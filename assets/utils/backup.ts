import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Message, BackupMetadata } from '../../types';

export class ChatBackup {
    static async createBackup(
        messages: Message[],
        mediaFiles: string[]
    ): Promise<BackupMetadata> {
        try {
            const backupDir = `${FileSystem.cacheDirectory}backup/`;
            const timestamp = new Date().toISOString();
            
            // Create backup directory
            await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });

            // Save messages JSON
            const messagesFile = `${backupDir}messages.json`;
            await FileSystem.writeAsStringAsync(
                messagesFile,
                JSON.stringify(messages, null, 2)
            );

            // Copy media files
            const mediaDir = `${backupDir}media/`;
            await FileSystem.makeDirectoryAsync(mediaDir, { intermediates: true });
            
            for (const mediaFile of mediaFiles) {
                const fileName = mediaFile.split('/').pop();
                if (fileName) {
                    await FileSystem.copyAsync({
                        from: mediaFile,
                        to: `${mediaDir}${fileName}`,
                    });
                }
            }

            // Create tar file using FileSystem.downloadAsync to compress the directory
            const tarFile = `${FileSystem.cacheDirectory}chat_backup_${timestamp}.tar`;
            await FileSystem.downloadAsync(
                `file://${backupDir}`,
                tarFile,
                {
                    headers: {
                        'Content-Type': 'application/x-tar'
                    }
                }
            );

            // Get backup size
            const fileInfo = await FileSystem.getInfoAsync(tarFile);
            const size = (fileInfo as FileSystem.FileInfo & { size: number }).size || 0;

            // Clean up temporary files
            await FileSystem.deleteAsync(backupDir, { idempotent: true });

            // Share backup file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(tarFile, {
                    dialogTitle: 'Save Chat Backup',
                    mimeType: 'application/x-tar',
                    UTI: 'public.tar-archive'
                });
            }

            // Clean up tar file after sharing
            await FileSystem.deleteAsync(tarFile, { idempotent: true });

            return {
                timestamp,
                messageCount: messages.length,
                mediaCount: mediaFiles.length,
                size,
            };
        } catch (error) {
            console.error('Backup creation failed:', error);
            throw new Error('Failed to create backup: ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    static async restoreBackup(backupFile: string): Promise<{
        messages: Message[];
        mediaFiles: string[];
    }> {
        try {
            // Verify backup file exists
            const backupExists = await FileSystem.getInfoAsync(backupFile);
            if (!backupExists.exists) {
                throw new Error('Backup file not found');
            }

            const backupDir = `${FileSystem.cacheDirectory}restore/`;
            await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });

            // Extract tar using FileSystem.uploadAsync
            await FileSystem.uploadAsync(
                `file://${backupDir}`,
                backupFile,
                {
                    headers: {
                        'Content-Type': 'application/x-tar'
                    }
                }
            );

            // Read messages
            const messagesFile = `${backupDir}messages.json`;
            const messagesExists = await FileSystem.getInfoAsync(messagesFile);
            if (!messagesExists.exists) {
                throw new Error('Invalid backup: messages.json not found');
            }

            const messagesJson = await FileSystem.readAsStringAsync(messagesFile);
            const messages = JSON.parse(messagesJson);

            // Ensure media directory exists in app documents
            const appMediaDir = `${FileSystem.documentDirectory}media/`;
            await FileSystem.makeDirectoryAsync(appMediaDir, { intermediates: true });

            // Copy media files to app directory
            const backupMediaDir = `${backupDir}media`;
            const mediaExists = await FileSystem.getInfoAsync(backupMediaDir);
            const restoredMediaFiles: string[] = [];

            if (mediaExists.exists) {
                const mediaFiles = await FileSystem.readDirectoryAsync(backupMediaDir);
                
                for (const file of mediaFiles) {
                    const newPath = `${appMediaDir}${file}`;
                    await FileSystem.copyAsync({
                        from: `${backupMediaDir}/${file}`,
                        to: newPath,
                    });
                    restoredMediaFiles.push(newPath);
                }
            }

            // Clean up
            await FileSystem.deleteAsync(backupDir, { idempotent: true });

            return {
                messages,
                mediaFiles: restoredMediaFiles,
            };
        } catch (error) {
            console.error('Backup restoration failed:', error);
            throw new Error('Failed to restore backup: ' + (error instanceof Error ? error.message : String(error)));
        }
    }
}
