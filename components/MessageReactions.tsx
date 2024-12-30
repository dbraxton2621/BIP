import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Message } from '../types';
import { Ionicons } from '@expo/vector-icons';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

interface MessageReactionsProps {
    message: Message;
    onReact: (reaction: string) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
    message,
    onReact,
}) => {
    const [showReactions, setShowReactions] = useState(false);

    const handleReaction = (reaction: string) => {
        onReact(reaction);
        setShowReactions(false);
    };

    const getReactionCount = (reaction: string) => {
        return message.reactions?.filter(r => r.reaction === reaction).length || 0;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setShowReactions(true)}
                style={styles.reactionButton}
            >
                <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            </TouchableOpacity>

            <Modal
                visible={showReactions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowReactions(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setShowReactions(false)}
                    activeOpacity={1}
                >
                    <View style={styles.reactionsList}>
                        {REACTIONS.map((reaction) => (
                            <TouchableOpacity
                                key={reaction}
                                onPress={() => handleReaction(reaction)}
                                style={styles.reactionItem}
                            >
                                <Text style={styles.reactionEmoji}>{reaction}</Text>
                                {getReactionCount(reaction) > 0 && (
                                    <Text style={styles.reactionCount}>
                                        {getReactionCount(reaction)}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {message.reactions && message.reactions.length > 0 && (
                <View style={styles.existingReactions}>
                    {Array.from(new Set(message.reactions.map(r => r.reaction))).map((reaction) => (
                        <View key={reaction} style={styles.reactionBubble}>
                            <Text style={styles.reactionEmoji}>{reaction}</Text>
                            <Text style={styles.reactionCount}>
                                {getReactionCount(reaction)}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
    },
    reactionButton: {
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactionsList: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
    },
    reactionItem: {
        padding: 8,
        alignItems: 'center',
    },
    reactionEmoji: {
        fontSize: 20,
    },
    reactionCount: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    existingReactions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    reactionBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 12,
        padding: 4,
        marginRight: 4,
        marginBottom: 4,
    }
});
