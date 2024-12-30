import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Thread, User } from '../types';

interface ThreadPreviewProps {
    thread: Thread;
    user: User;
}

export const ThreadPreview: React.FC<ThreadPreviewProps> = ({ thread, user }) => {
    return (
        <View style={styles.threadContainer}>
            <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar}
                defaultSource={require('../assets/images/icon.png')}
            />
            <View style={styles.threadInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {thread.lastMessage.content}
                </Text>
            </View>
            <View style={styles.threadMeta}>
                <Text style={styles.timestamp}>
                    {formatDistanceToNow(new Date(thread.lastMessage.timestamp), { addSuffix: true })}
                </Text>
                {thread.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{thread.unreadCount}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    threadContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    threadInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    threadMeta: {
        alignItems: 'flex-end',
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    unreadBadge: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
