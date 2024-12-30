// Comments.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Comment } from './../types';

interface CommentsProps {
    postId: string;
    comments: Comment[];
    onAddComment: (postId: string, text: string) => void;
    onLikeComment?: (commentId: string) => void;
    onReplyToComment?: (commentId: string) => void;
}

export const Comments = ({
    postId,
    comments,
    onAddComment,
    onLikeComment,
    onReplyToComment,
    }: CommentsProps) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = () => {
        if (newComment.trim()) {
        onAddComment(postId, newComment.trim());
        setNewComment('');
        }
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleDateString()}
            </Text>
        </View>
        
        <Text style={styles.commentText}>{item.text}</Text>
        
        <View style={styles.commentActions}>
            {onLikeComment && (
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onLikeComment(item.id)}
            >
                <Feather name="heart" size={16} color="#657786" />
                <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            )}
            
            {onReplyToComment && (
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onReplyToComment(item.id)}
            >
                <Feather name="message-circle" size={16} color="#657786" />
                <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
            )}
        </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        >
        <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.commentsList}
        />
        
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            multiline
            maxLength={1000}
            />
            <TouchableOpacity
            style={[
                styles.submitButton,
                !newComment.trim() && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim()}
            >
            <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    commentsList: {
        padding: 16,
    },
    commentContainer: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
        paddingBottom: 16,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    username: {
        fontWeight: '600',
        fontSize: 14,
    },
    timestamp: {
        fontSize: 12,
        color: '#657786',
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    commentActions: {
        flexDirection: 'row',
        gap: 16,
    },
        actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 12,
        color: '#657786',
    },
    inputContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e1e8ed',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        borderRadius: 20,
        padding: 12,
        paddingTop: 12,
        fontSize: 16,
        maxHeight: 100,
        backgroundColor: '#f5f8fa',
    },
    submitButton: {
        backgroundColor: '#1DA1F2',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#9BD0F7',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});