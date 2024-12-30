import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { format } from 'date-fns';
import { Message } from '../types';
import { MessageMedia } from './MessageMedia';
import { MessageReactions } from './MessageReactions';
import { LinkPreviewCard } from './LinkPreviewCard';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessageProps {
    message: Message;
    isOwn: boolean;
    onLongPress?: (message: Message) => void;
    onReact?: (messageId: string, reaction: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
    message, 
    isOwn, 
    onLongPress,
    onReact 
}) => {
    const handleLongPress = () => {
        if (onLongPress) {
            onLongPress(message);
        }
    };

    const handleReact = (reaction: string) => {
        if (onReact) {
            onReact(message.id, reaction);
        }
    };

    const handleLinkPress = (url: string) => {
        Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
    };

    return (
        <TouchableOpacity 
            onLongPress={handleLongPress}
            activeOpacity={0.9}
            style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}
        >
            <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
                {message.forwardedFrom && (
                    <Text style={[styles.forwardedText, isOwn ? styles.ownForwardedText : styles.otherForwardedText]}>
                        Forwarded from {message.forwardedFrom}
                    </Text>
                )}
                
                {message.type !== 'text' && <MessageMedia message={message} />}
                
                <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
                    {message.content}
                </Text>

                {message.linkPreviews && message.linkPreviews.length > 0 && (
                    <LinkPreviewCard 
                        preview={message.linkPreviews[0]} 
                        onPress={() => handleLinkPress(message.linkPreviews![0].url)}
                    />
                )}

                <MessageReactions 
                    message={message}
                    onReact={handleReact}
                />

                <View style={styles.messageFooter}>
                    {message.editHistory && message.editHistory.length > 0 && (
                        <Text style={[styles.editedText, isOwn ? styles.ownEditedText : styles.otherEditedText]}>
                            edited
                        </Text>
                    )}
                    <Text style={[styles.timestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
                        {format(new Date(message.timestamp), 'HH:mm')}
                    </Text>
                    {isOwn && (
                        <Ionicons
                            name={message.status === 'sent' ? (message.read ? 'checkmark-done' : 'checkmark') : 
                                  message.status === 'sending' ? 'time-outline' : 'alert-circle-outline'}
                            size={16}
                            color={message.read ? '#34C759' : '#A8A8A8'}
                            style={styles.readReceipt}
                        />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
        marginHorizontal: 8,
    },
    ownMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
    },
    ownBubble: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#E8E8E8',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    ownText: {
        color: '#FFFFFF',
    },
    otherText: {
        color: '#000000',
    },
    forwardedText: {
        fontSize: 12,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    ownForwardedText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherForwardedText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    editedText: {
        fontSize: 12,
        marginRight: 4,
        fontStyle: 'italic',
    },
    ownEditedText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherEditedText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    timestamp: {
        fontSize: 12,
    },
    ownTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTimestamp: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    readReceipt: {
        marginLeft: 4,
    }
});
