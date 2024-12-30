import { Message } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export class OfflineSync {
    private static readonly PENDING_MESSAGES_KEY = 'pendingMessages';
    private static readonly FAILED_MESSAGES_KEY = 'failedMessages';

    static async initialize() {
        // Start network listener
        NetInfo.addEventListener(state => {
        if (state.isConnected) {
            this.syncPendingMessages();
        }
        });
    }

    static async savePendingMessage(message: Message) {
        try {
        const pendingMessages = await this.getPendingMessages();
        pendingMessages.push(message);
        await AsyncStorage.setItem(
            this.PENDING_MESSAGES_KEY,
            JSON.stringify(pendingMessages)
        );
        } catch (error) {
        console.error('Failed to save pending message:', error);
        }
    }

    static async syncPendingMessages() {
        try {
        const pendingMessages = await this.getPendingMessages();
        const failedMessages: Message[] = [];

        for (const message of pendingMessages) {
            try {
            // Attempt to send message
            await this.sendMessage(message);
            } catch (error) {
            failedMessages.push(message);
            }
        }

        // Update storage
        await AsyncStorage.setItem(
            this.FAILED_MESSAGES_KEY,
            JSON.stringify(failedMessages)
        );
        await AsyncStorage.setItem(
            this.PENDING_MESSAGES_KEY,
            JSON.stringify([])
        );
        } catch (error) {
        console.error('Failed to sync messages:', error);
        }
    }

    private static async getPendingMessages(): Promise<Message[]> {
        try {
        const messages = await AsyncStorage.getItem(this.PENDING_MESSAGES_KEY);
        return messages ? JSON.parse(messages) : [];
        } catch (error) {
        console.error('Failed to get pending messages:', error);
        return [];
        }
    }

    private static async sendMessage(message: Message): Promise<void> {
        // Implement your message sending logic here
        // This should interact with your backend API
    }
}