import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MediaModal } from './MediaModal';

interface MediaItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
    width: number;
    height: number;
}

interface MediaPost {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
    media: MediaItem[];
    likes: number;
    comments: number;
    isLiked: boolean;
    isSaved: boolean;
}

interface MediaListProps {
    userId?: string;
    onMediaPress?: (postId: string) => void;
    onProfilePress?: (userId: string) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export default function MediaList({
    userId,
    onMediaPress,
    onProfilePress,
    ListHeaderComponent
}: MediaListProps) {
    const [mediaPosts, setMediaPosts] = useState<MediaPost[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedPost, setSelectedPost] = useState<MediaPost | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchMediaPosts = useCallback(async (pageNum: number, refresh = false) => {
        try {
            setLoading(true);
            // Simulated response with dummy data
            const mockPosts: MediaPost[] = [
                {
                    id: '1',
                    userId: 'user1',
                    username: 'JohnDoe',
                    content: 'Check out this amazing dunk! 🏀',
                    timestamp: new Date('2024-01-15T10:00:00'),
                    media: [
                        {
                            id: 'media1',
                            type: 'video',
                            url: 'https://example.com/dunk-video.mp4',
                            thumbnailUrl: 'https://picsum.photos/400/400',
                            width: 1920,
                            height: 1080
                        }
                    ],
                    likes: 156,
                    comments: 23,
                    isLiked: false,
                    isSaved: false
                },
                {
                    id: '2',
                    userId: 'user2',
                    username: 'BasketballFanatic',
                    content: 'Game highlights from last night 🔥',
                    timestamp: new Date('2024-01-14T20:30:00'),
                    media: [
                        {
                            id: 'media2',
                            type: 'image',
                            url: 'https://picsum.photos/401/401',
                            width: 1200,
                            height: 800
                        },
                        {
                            id: 'media3',
                            type: 'image',
                            url: 'https://picsum.photos/402/402',
                            width: 1200,
                            height: 800
                        }
                    ],
                    likes: 89,
                    comments: 12,
                    isLiked: true,
                    isSaved: true
                },
                // ... other mock posts ...
            ];
            
            if (refresh) {
                setMediaPosts(mockPosts);
            } else {
                setMediaPosts(prev => [...prev, ...mockPosts]);
            }
            
            setHasMore(mockPosts.length === 12);
        } catch (error) {
            console.error('Error fetching media posts:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchMediaPosts(1, true);
    }, [fetchMediaPosts]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        await fetchMediaPosts(1, true);
        setRefreshing(false);
    }, [fetchMediaPosts]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMediaPosts(nextPage);
        }
    }, [loading, hasMore, page, fetchMediaPosts]);

    const handleMediaPress = useCallback((post: MediaPost) => {
        setSelectedPost(post);
        setModalVisible(true);
        onMediaPress?.(post.id);
    }, [onMediaPress]);

    const handleLike = useCallback(async (postId: string) => {
        try {
            setMediaPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            isLiked: !post.isLiked,
                            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }, []);

    const handleSave = useCallback(async (postId: string) => {
        try {
            setMediaPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? { ...post, isSaved: !post.isSaved }
                        : post
                )
            );
        } catch (error) {
            console.error('Error saving post:', error);
        }
    }, []);

    const handleComment = useCallback((postId: string) => {
        // Implement comment functionality
        console.log('Comment on post:', postId);
    }, []);

    const handleShare = useCallback((postId: string) => {
        // Implement share functionality
        console.log('Share post:', postId);
    }, []);

    const renderMediaPost = useCallback(({ item: post }: { item: MediaPost }) => {
        const firstMedia = post.media[0];
        const screenWidth = Dimensions.get('window').width;
        const imageSize = (screenWidth - 48) / 3;

        return (
            <TouchableOpacity
                style={[styles.mediaContainer, { width: imageSize, height: imageSize }]}
                onPress={() => handleMediaPress(post)}
            >
                <Image
                    source={{ uri: firstMedia.thumbnailUrl || firstMedia.url }}
                    style={styles.mediaThumbnail}
                />
                {post.media.length > 1 && (
                    <View style={styles.multipleIndicator}>
                        <Feather name="layers" size={14} color="#fff" />
                    </View>
                )}
                {firstMedia.type === 'video' && (
                    <View style={styles.videoIndicator}>
                        <Feather name="play" size={14} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    }, [handleMediaPress]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {loading ? 'Loading media...' : 'No media posts yet'}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!loading || !hasMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#1DA1F2" />
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={mediaPosts}
                renderItem={renderMediaPost}
                keyExtractor={item => item.id}
                numColumns={3}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#1DA1F2"
                        colors={['#1DA1F2']}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[
                    styles.contentContainer,
                    mediaPosts.length === 0 && styles.emptyList
                ]}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            />

            {selectedPost && (
                <MediaModal
                    isVisible={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedPost(null);
                    }}
                    post={{
                        ...selectedPost,
                        comments: [] // Add empty comments array to match Post type
                    }}
                    onLike={handleLike}
                    onComment={handleComment}
                    onSave={handleSave}
                    onShare={handleShare}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
        padding: 16,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    row: {
        justifyContent: 'flex-start',
    },
    mediaContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    mediaThumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E1E8ED',
    },
    multipleIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 4,
        padding: 4,
    },
    videoIndicator: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 4,
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.4,
    },
    emptyText: {
        fontSize: 16,
        color: '#657786',
        textAlign: 'center',
    },
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
});
