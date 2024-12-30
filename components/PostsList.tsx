// PostList.tsx
import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Post } from './../components/Post';
import { Comments } from './../components/Comments';
import { Post as PostType } from '../types';

interface PostListProps {
    userId?: string;
    isPinnedList?: boolean;
    isProfileView?: boolean;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

// Mock data generation function
const generateMockPosts = (page: number, userId?: string, isProfileView = false): PostType[] => {
    const postsPerPage = 10;
    const startIndex = (page - 1) * postsPerPage;
    
    const mockPosts: PostType[] = [
        {
            id: "1",
            userId: "user1",
            username: "JohnDoe",
            content: "Just finished analyzing Trevor Lawrence's game against the Chiefs. His decision-making under pressure has improved significantly this season.",
            timestamp: new Date(),
            likes: 45,
            comments: [
                {
                    id: "c1",
                    userId: "user2",
                    username: "FootballExpert",
                    text: "Agreed! His pocket presence is much better too.",
                    timestamp: new Date()
                }
            ],
            isLiked: false,
            isSaved: false,
            isPinned: false,
            allowComments: true
        },
        {
            id: "2",
            userId: "user2",
            username: "ScoutPro",
            content: "Breaking down film on the top 5 WR prospects for the 2024 draft. Marvin Harrison Jr. stands out with his route-running precision and catch radius.",
            timestamp: new Date(),
            likes: 72,
            comments: [],
            isLiked: true,
            isSaved: true,
            isPinned: false,
            allowComments: true
        },
        {
            id: "3",
            userId: "user3",
            username: "NFLAnalyst",
            content: "Impressive defensive performance by the 49ers. Their linebacker corps is showing elite play recognition and gap discipline.",
            timestamp: new Date(),
            likes: 38,
            comments: [
                {
                    id: "c2",
                    userId: "user4",
                    username: "DefensiveGuru",
                    text: "Fred Warner is playing at an All-Pro level!",
                    timestamp: new Date()
                }
            ],
            isLiked: false,
            isSaved: false,
            isPinned: false,
            allowComments: true
        },
        {
            id: "4",
            userId: "user4",
            username: "DraftScout",
            content: "Watching Caleb Williams tape from the past season. His improvisational skills are reminiscent of Patrick Mahomes. Could be a franchise-changing QB.",
            timestamp: new Date(),
            likes: 95,
            comments: [],
            isLiked: false,
            isSaved: true,
            isPinned: false,
            allowComments: true
        },
        {
            id: "5",
            userId: "user5",
            username: "TalentEvaluator",
            content: "Key observations from Senior Bowl practices: The offensive line class is deeper than initially thought. Several day 2 prospects showing starter potential.",
            timestamp: new Date(),
            likes: 56,
            comments: [
                {
                    id: "c4",
                    userId: "user6",
                    username: "OLineSpecialist",
                    text: "The tackle from Wisconsin is really impressing in 1-on-1 drills",
                    timestamp: new Date()
                }
            ],
            isLiked: true,
            isSaved: false,
            isPinned: false,
            allowComments: true
        }
    ];

    // Filter posts based on userId and view type
    let filteredPosts = mockPosts;
    if (userId && isProfileView) {
        // In profile view, only show posts from the specified user
        filteredPosts = mockPosts.filter(post => post.userId === userId);
    } else if (userId && !isProfileView) {
        // In home view, show posts from everyone except the current user
        filteredPosts = mockPosts.filter(post => post.userId !== userId);
    }

    // Return a slice of filtered posts based on the page number
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
};

export default function PostList({
    userId,
    isPinnedList = false,
    isProfileView = false,
    ListHeaderComponent
}: PostListProps) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    const fetchPosts = useCallback(async (pageNum: number, refresh = false) => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockPosts = generateMockPosts(pageNum, userId, isProfileView);
            
            if (refresh) {
                setPosts(mockPosts);
            } else {
                setPosts(prev => [...prev, ...mockPosts]);
            }
            
            setHasMore(mockPosts.length === 10);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, isPinnedList, isProfileView]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        await fetchPosts(1, true);
        setRefreshing(false);
    }, [fetchPosts]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    }, [loading, hasMore, page, fetchPosts]);

    const handleLike = useCallback(async (postId: string) => {
        try {
            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }, []);

    const handleSave = useCallback(async (postId: string) => {
        try {
            setPosts(currentPosts =>
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

    const handleShare = useCallback((postId: string) => {
        // Implement share functionality
    }, []);

    const handleComment = useCallback((postId: string) => {
        setActiveCommentId(activeCommentId === postId ? null : postId);
    }, [activeCommentId]);

    const handleUpdatePost = useCallback((postId: string, content: string) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === postId
                    ? { ...post, content }
                    : post
            )
        );
    }, []);

    const handleDeletePost = useCallback((postId: string) => {
        setPosts(currentPosts =>
            currentPosts.filter(post => post.id !== postId)
        );
    }, []);

    const handleToggleComments = useCallback((postId: string) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === postId
                    ? { ...post, allowComments: !post.allowComments }
                    : post
            )
        );
    }, []);

    const addComment = useCallback(async (postId: string, text: string) => {
        try {
            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            comments: [...post.comments, {
                                id: Date.now().toString(),
                                userId: "current-user-id",
                                username: "Current User",
                                text,
                                timestamp: new Date(),
                            }]
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }, []);

    const renderItem = useCallback(({ item: post }: { item: PostType }) => (
        <View style={styles.postContainer}>
            <Post
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onSave={handleSave}
                onShare={handleShare}
                onUpdatePost={isProfileView ? handleUpdatePost : undefined}
                onDeletePost={isProfileView ? handleDeletePost : undefined}
                onToggleComments={isProfileView ? handleToggleComments : undefined}
            />
            
            {activeCommentId === post.id && (
                <Comments
                    postId={post.id}
                    comments={post.comments}
                    onAddComment={addComment}
                />
            )}
        </View>
    ), [handleLike, handleComment, handleSave, handleShare, activeCommentId, addComment, isProfileView, handleUpdatePost, handleDeletePost, handleToggleComments]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {loading ? "Loading posts..." : isProfileView ? "No posts yet" : "No posts from other users"}
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

    // Initial fetch
    React.useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    return (
        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#1DA1F2"
                    colors={["#1DA1F2"]}
                />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={[
                styles.contentContainer,
                posts.length === 0 && styles.emptyList
            ]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
        />
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
    postContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
