import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Thread, Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { Ionicons } from '@expo/vector-icons';

interface MessageThreadProps {
    parentMessage: Message;
    replies: Message[];
    onReply: () => void;
    currentUserId: string;
    loading?: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
    parentMessage,
    replies,
    onReply,
    currentUserId,
    loading = false,
}) => {
    const [expanded, setExpanded] = useState(false);
    
    const uniqueParticipants = new Set([
        parentMessage.senderId,
        ...replies.map(reply => reply.senderId)
    ]);

    return (
        <View style={styles.container}>
            <View style={styles.threadHeader}>
                <Text style={styles.threadTitle}>Thread</Text>
                <Text style={styles.participantCount}>
                    {uniqueParticipants.size} participant{uniqueParticipants.size !== 1 ? 's' : ''}
                </Text>
            </View>

            <View style={styles.threadContent}>
                <ChatMessage 
                    message={parentMessage}
                    isOwn={parentMessage.senderId === currentUserId}
                    onLongPress={() => {}} // Disable long press in thread view
                />
                
                {replies.length > 0 && (
                    <View style={styles.repliesSection}>
                        <TouchableOpacity
                            style={styles.repliesHeader}
                            onPress={() => setExpanded(!expanded)}
                        >
                            <View style={styles.repliesInfo}>
                                <Text style={styles.repliesCount}>
                                    {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                </Text>
                                <Text style={styles.lastReplyTime}>
                                    Last reply {formatDistanceToNow(new Date(replies[replies.length - 1].timestamp))} ago
                                </Text>
                            </View>
                            <Ionicons 
                                name={expanded ? 'chevron-up' : 'chevron-down'} 
                                size={20} 
                                color="#007AFF" 
                            />
                        </TouchableOpacity>

                        {expanded && (
                            <View style={styles.repliesList}>
                                {loading ? (
                                    <ActivityIndicator style={styles.loading} color="#007AFF" />
                                ) : (
                                    replies.map((reply) => (
                                        <ChatMessage
                                            key={reply.id}
                                            message={reply}
                                            isOwn={reply.senderId === currentUserId}
                                            onLongPress={() => {}} // Disable long press in thread view
                                        />
                                    ))
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>

            <TouchableOpacity 
                style={styles.replyButton} 
                onPress={onReply}
                disabled={loading}
            >
                <Ionicons name="return-down-forward" size={20} color="#007AFF" />
                <Text style={styles.replyButtonText}>Reply to thread</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    threadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    threadTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    participantCount: {
        fontSize: 14,
        color: '#666',
    },
    threadContent: {
        flex: 1,
        padding: 16,
    },
    repliesSection: {
        marginTop: 16,
    },
    repliesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    repliesInfo: {
        flex: 1,
    },
    repliesCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    lastReplyTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    repliesList: {
        marginTop: 8,
    },
    loading: {
        padding: 20,
    },
    replyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    },
    replyButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007AFF',
    },
});
