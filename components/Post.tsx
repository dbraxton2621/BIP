import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Post as PostType } from './../types';
import { Link } from 'expo-router';
import { useHighlights } from '../context/HighlightsContext';

interface PostProps {
    post: PostType;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onSave: (postId: string) => void;
    onShare: (postId: string) => void;
    onUpdatePost?: (postId: string, content: string) => void;
    onDeletePost?: (postId: string) => void;
    onToggleComments?: (postId: string) => void;
}

export const Post = ({ 
    post, 
    onLike, 
    onComment, 
    onSave, 
    onShare,
    onUpdatePost,
    onDeletePost,
    onToggleComments
}: PostProps) => {
    const [showComments, setShowComments] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState(post.content);
    const { addToHighlights, removeFromHighlights } = useHighlights();

    const handleOptionsPress = () => {
        setShowOptionsModal(true);
    };

    const handleToggleComments = useCallback(() => {
        if (onToggleComments) {
            onToggleComments(post.id);
        }
        setShowOptionsModal(false);
    }, [post.id, onToggleComments]);

    const handleEditSubmit = useCallback(() => {
        if (onUpdatePost) {
            onUpdatePost(post.id, editText);
        }
        setEditMode(false);
        setShowOptionsModal(false);
    }, [post.id, editText, onUpdatePost]);

    const handleDelete = useCallback(() => {
        if (onDeletePost) {
            onDeletePost(post.id);
        }
        setShowOptionsModal(false);
    }, [post.id, onDeletePost]);

    const handleHighlightAction = useCallback(() => {
        if (post.isPinned) {
            removeFromHighlights(post.id);
        } else {
            addToHighlights(post);
        }
        setShowOptionsModal(false);
    }, [post, addToHighlights, removeFromHighlights]);

    return (
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                <Text style={styles.username}>{post.username}</Text>
                <TouchableOpacity onPress={handleOptionsPress}>
                    <Feather name="more-horizontal" size={20} color="#657786" />
                </TouchableOpacity>
            </View>

            <Text style={styles.content}>{post.content}</Text>

            {post.media && post.media.length > 0 && (
                <ScrollView horizontal style={styles.mediaContainer}>
                    {post.media.map((item) => (
                        <View key={item.id} style={styles.mediaItem}>
                            {item.type === 'image' && (
                                <Image 
                                    source={{ uri: item.uri }} 
                                    style={styles.mediaImage}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}

            <View style={styles.actions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onLike(post.id)}
                >
                    <Feather 
                        name={post.isLiked ? "heart" : "heart"} 
                        size={20} 
                        color={post.isLiked ? "#FF4D4D" : "#657786"}
                    />
                    <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                
                {post.allowComments !== false && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => onComment(post.id)}
                    >
                        <Feather name="message-circle" size={20} color="#657786" />
                        <Text style={styles.actionText}>{post.comments.length}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onSave(post.id)}
                >
                    <Feather 
                        name={post.isSaved ? "bookmark" : "bookmark"} 
                        size={20} 
                        color="#657786"
                    />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onShare(post.id)}
                >
                    <Feather name="share-2" size={20} color="#657786" />
                </TouchableOpacity>
            </View>

            {showComments && (
                <View style={styles.comments}>
                    {post.comments.map((comment) => (
                        <View key={comment.id} style={styles.comment}>
                            <Text style={styles.commentUsername}>{comment.username}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                    ))}
                </View>
            )}

            <Modal
                visible={showOptionsModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowOptionsModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowOptionsModal(false)}
                >
                    <View style={styles.modalContent}>
                        {onToggleComments && (
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={handleToggleComments}
                            >
                                <Feather
                                    name="message-circle"
                                    size={20}
                                    color="#657786"
                                />
                                <Text style={styles.modalOptionText}>
                                    {post.allowComments === false ? 'Enable' : 'Disable'} Comments
                                </Text>
                            </TouchableOpacity>
                        )}

                        {onUpdatePost && (
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    setEditMode(true);
                                    setShowOptionsModal(false);
                                }}
                            >
                                <Feather name="edit-2" size={20} color="#657786" />
                                <Text style={styles.modalOptionText}>Edit Post</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleHighlightAction}
                        >
                            <Feather 
                                name="star" 
                                size={20} 
                                color={post.isPinned ? "#FFD700" : "#657786"} 
                            />
                            <Text style={styles.modalOptionText}>
                                {post.isPinned ? 'Remove from' : 'Add to'} Highlights
                            </Text>
                        </TouchableOpacity>

                        {onDeletePost && (
                            <TouchableOpacity
                                style={[styles.modalOption, styles.deleteOption]}
                                onPress={handleDelete}
                            >
                                <Feather name="trash-2" size={20} color="#FF3B30" />
                                <Text style={[styles.modalOptionText, styles.deleteText]}>Delete Post</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={editMode}
                transparent
                animationType="slide"
                onRequestClose={() => setEditMode(false)}
            >
                <View style={styles.editModalContent}>
                    <View style={styles.editHeader}>
                        <Text style={styles.editTitle}>Edit Post</Text>
                        <TouchableOpacity onPress={() => setEditMode(false)}>
                            <Feather name="x" size={24} color="#657786" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.editInput}
                        value={editText}
                        onChangeText={setEditText}
                        multiline
                        autoFocus
                    />
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleEditSubmit}
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    username: {
        fontWeight: '600',
    },
    timestamp: {
        color: '#657786',
    },
    content: {
        marginBottom: 10,
        lineHeight: 20,
    },
    mediaContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    mediaItem: {
        marginRight: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    mediaImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionText: {
        color: '#657786',
    },
    comments: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    comment: {
        marginBottom: 10,
    },
    commentUsername: {
        fontWeight: '600',
        marginBottom: 2,
    },
    commentText: {
        color: '#14171A',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 12,
    },
    modalOptionText: {
        fontSize: 16,
        color: '#14171A',
    },
    deleteOption: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 10,
        paddingTop: 15,
    },
    deleteText: {
        color: '#FF3B30',
    },
    editModalContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    editHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    editTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    editInput: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#1DA1F2',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
