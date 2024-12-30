import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { ChatMessage } from '../../components/ChatMessage';
import { dummyMessages, dummyUsers } from '../../assets/utils/dummyData';
import { Message, Thread } from '../../types';
import { E2EEncryption } from '../../assets/utils/encryption';
import { MediaPicker } from '../../components/MediaPicker';
import { TypeIndicator } from '../../components/TypeIndicator';
import { MessageEditor } from '../../components/MessageEditor';
import { ChatBackup } from '../../assets/utils/backup';
import { OfflineSync } from '../../assets/utils/offlineSync';
import { LinkPreviewGenerator } from '../../assets/utils/linkPreview';
import { Stack } from 'expo-router';

interface ChatScreenProps {
    id: string;
}

export default function ChatScreen({ id }: ChatScreenProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const [threads, setThreads] = useState<Record<string, Thread>>({});
    const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
    const currentUserId = '1'; // This would come from your auth context
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [scheduledMessages, setScheduledMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!id) return;
        
        // Simulate loading messages
        const loadMessages = async () => {
            // In a real app, you would fetch messages from your backend using the chat id
            setTimeout(() => {
                setMessages(dummyMessages.filter(msg => 
                    msg.senderId === id || msg.receiverId === id
                ));
                setIsLoading(false);
            }, 1000);
        };

        loadMessages();
    }, [id]);

    useEffect(() => {
        // Initialize E2E encryption
        const initEncryption = async () => {
            const key = await E2EEncryption.generateKey();
            setEncryptionKey(key);
        };
        initEncryption();
    }, []);

    useEffect(() => {
        // Initialize offline sync
        OfflineSync.initialize();
    }, []);

    const handleSend = () => {
        if (message.trim().length === 0 || !id) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: message,
            senderId: currentUserId,
            receiverId: id,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text',
            encrypted: false,
            status: 'sent'
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Scroll to bottom
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const handleForwardMessage = (message: Message) => {
        // TODO: Implement forwarding with Expo Router
    };

    const handleMessageEdit = async (messageId: string, newContent: string) => {
        const updatedMessages = messages.map(msg => {
            if (msg.id === messageId) {
                return {
                    ...msg,
                    content: newContent,
                    editHistory: [
                        ...(msg.editHistory || []),
                        {
                            content: msg.content,
                            timestamp: new Date().toISOString(),
                        },
                    ],
                };
            }
            return msg;
        });
    
        setMessages(updatedMessages);
        setEditingMessage(null);
    };

    const handleMessageSchedule = async (content: string, date: Date) => {
        if (!id) return;
        
        const scheduledMessage: Message = {
            id: Date.now().toString(),
            content,
            senderId: currentUserId,
            receiverId: id,
            timestamp: new Date().toISOString(),
            scheduledFor: date.toISOString(),
            status: 'scheduled',
            read: false,
            type: 'text',
            encrypted: true,
        };
    
        setScheduledMessages(prev => [...prev, scheduledMessage]);
    };
    
    const extractLinks = (content: string): string[] => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.match(urlRegex) || [];
    };
    
    const handleMessageSend = async (content: string) => {
        if (!id) return;
        
        // Check for links and generate previews
        const links = extractLinks(content);
        const linkPreviews = await Promise.all(
            links.map(link => LinkPreviewGenerator.generatePreview(link))
        );
    
        const newMessage: Message = {
            id: Date.now().toString(),
            content: content,
            senderId: currentUserId,
            receiverId: id,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text',
            encrypted: false,
            status: 'sent',
            linkPreviews
        };
    
        // Check network status
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) {
            await OfflineSync.savePendingMessage(newMessage);
            return;
        }
    
        // Send message
        try {
            // Your sending logic
            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            await OfflineSync.savePendingMessage(newMessage);
        }
    };
    
    const handleBackup = async () => {
        try {
            const mediaFiles = messages
                .filter(msg => msg.type === 'image' || msg.type === 'voice')
                .map(msg => msg.mediaUrl!)
                .filter(Boolean);
        
            const metadata = await ChatBackup.createBackup(messages, mediaFiles);
            console.log('Backup created:', metadata);
        } catch (error) {
            console.error('Backup failed:', error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const handleTyping = () => {
        setIsTyping(true);
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1500);
    };

    const handleMediaSelect = async (media: { uri: string; type: string; name?: string }) => {
        if (!id) return;
        
        // In a real app, you would upload the media to your server here
        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUserId,
            receiverId: id,
            content: media.type === 'image' ? 'Sent an image' : `Sent a file: ${media.name}`,
            timestamp: new Date().toISOString(),
            read: false,
            type: media.type as 'image' | 'file',
            mediaUrl: media.uri,
            fileName: media.name,
            encrypted: false,
            status: 'sent'
        };
    
        setMessages(prev => [...prev, newMessage]);
    };
    
    const loadMoreMessages = async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);
    
        // Simulate loading more messages
        setTimeout(() => {
            // In a real app, you would fetch more messages from your backend
            // based on the current page
            setPage(prev => prev + 1);
            setIsLoadingMore(false);
        }, 1000);
    };

    const renderItem = ({ item }: { item: Message }) => (
        <ChatMessage
            message={item}
            isOwn={item.senderId === currentUserId}
        />
    );

    const keyExtractor = (item: Message) => item.id;

    return (
        <>
            <Stack.Screen 
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.backupButton}
                            onPress={handleBackup}
                        >
                            <Ionicons name="cloud-upload" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    onEndReached={loadMoreMessages}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={isLoadingMore ? <ActivityIndicator /> : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingMore}
                            onRefresh={loadMoreMessages}
                        />
                    }
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={15}
                />
                <TypeIndicator isVisible={isTyping} />
                <View style={styles.inputContainer}>
                    <MediaPicker onMediaSelect={handleMediaSelect} />
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={(text) => {
                            setMessage(text);
                            handleTyping();
                        }}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!message.trim()}
                    >
                        <Ionicons name="send" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
                {editingMessage && (
                    <MessageEditor
                        message={editingMessage}
                        onSave={(content) => handleMessageEdit(editingMessage.id, content)}
                        onCancel={() => setEditingMessage(null)}
                    />
                )}
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageList: {
        paddingVertical: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        padding: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    fileName: {
        marginLeft: 10,
        color: '#007AFF',
        fontSize: 14,
    },
    backupButton: {
        padding: 8,
    },
});
