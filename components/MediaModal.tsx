import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post } from './Post';
import { Comments } from './Comments';
import { LikesList } from './LikesList';
import { Post as PostType } from '../types';

interface MediaModalProps {
    isVisible: boolean;
    onClose: () => void;
    post: PostType & {
        media: {
            id: string;
            type: 'image' | 'video';
            url: string;
            thumbnailUrl?: string;
            width: number;
            height: number;
        }[];
    };
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onSave: (postId: string) => void;
    onShare: (postId: string) => void;
    onUpdatePost?: (postId: string, content: string) => void;
    onDeletePost?: (postId: string) => void;
    onToggleComments?: (postId: string) => void;
    onAddComment?: (postId: string, text: string) => void;
    onLikeComment?: (commentId: string) => void;
    onReplyToComment?: (commentId: string) => void;
}

export const MediaModal = ({
    isVisible,
    onClose,
    post,
    onLike,
    onComment,
    onSave,
    onShare,
    onUpdatePost,
    onDeletePost,
    onToggleComments,
    onAddComment,
    onLikeComment,
    onReplyToComment,
}: MediaModalProps) => {
    const screenWidth = Dimensions.get('window').width;
    const [showComments, setShowComments] = useState(false);
    const [showLikes, setShowLikes] = useState(false);

    // Mocked likes data - replace with actual data in production
    const mockLikes = post.likes > 0 ? Array(post.likes).fill(0).map((_, i) => ({
        id: i.toString(),
        username: `User ${i + 1}`,
    })) : [];

    const handleCommentPress = (postId: string) => {
        setShowComments(true);
        onComment(postId);
    };

    const handleLikePress = (postId: string) => {
        onLike(postId);
        setShowLikes(true);
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Feather name="x" size={24} color="#657786" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <ScrollView 
                        horizontal 
                        pagingEnabled 
                        showsHorizontalScrollIndicator={false}
                        style={[styles.mediaContainer, { width: screenWidth }]}
                    >
                        {post.media.map((media) => (
                            <View key={media.id} style={{ width: screenWidth }}>
                                <Image
                                    source={{ uri: media.url }}
                                    style={[
                                        styles.mediaImage,
                                        {
                                            width: screenWidth,
                                            height: screenWidth * (media.height / media.width),
                                        }
                                    ]}
                                    resizeMode="contain"
                                />
                                {media.type === 'video' && (
                                    <View style={styles.playButton}>
                                        <Feather name="play" size={40} color="#fff" />
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.postContainer}>
                        <Post
                            post={post}
                            onLike={handleLikePress}
                            onComment={handleCommentPress}
                            onSave={onSave}
                            onShare={onShare}
                            onUpdatePost={onUpdatePost}
                            onDeletePost={onDeletePost}
                            onToggleComments={onToggleComments}
                        />
                    </View>
                </ScrollView>

                {/* Comments Modal */}
                <Modal
                    visible={showComments}
                    animationType="slide"
                    onRequestClose={() => setShowComments(false)}
                >
                    <SafeAreaView style={styles.commentsContainer}>
                        <View style={styles.commentsHeader}>
                            <TouchableOpacity onPress={() => setShowComments(false)}>
                                <Feather name="arrow-left" size={24} color="#657786" />
                            </TouchableOpacity>
                            <Text style={styles.commentsTitle}>Comments</Text>
                            <View style={{ width: 24 }} /> {/* Spacer for alignment */}
                        </View>
                        
                        <Comments
                            postId={post.id}
                            comments={post.comments}
                            onAddComment={onAddComment || (() => {})}
                            onLikeComment={onLikeComment}
                            onReplyToComment={onReplyToComment}
                        />
                    </SafeAreaView>
                </Modal>

                {/* Likes List Modal */}
                <LikesList
                    isVisible={showLikes}
                    onClose={() => setShowLikes(false)}
                    likes={mockLikes}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
    },
    mediaContainer: {
        backgroundColor: '#000',
    },
    mediaImage: {
        backgroundColor: '#E1E8ED',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 30,
        padding: 10,
    },
    postContainer: {
        backgroundColor: '#fff',
    },
    commentsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
});
