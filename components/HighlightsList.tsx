import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Post } from './../components/Post';
import { Comments } from './../components/Comments';
import { useHighlights } from '../context/HighlightsContext';

interface HighlightsListProps {
    userId?: string;
    onPostPress?: (postId: string) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export default function HighlightsList({
    userId,
    onPostPress,
    ListHeaderComponent
}: HighlightsListProps) {
    const { pinnedPosts, removeFromHighlights } = useHighlights();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        // In a real app, you might want to re-fetch pinned posts here
        setRefreshing(false);
    }, []);

    const handleLike = useCallback(async (postId: string) => {
        // Handle like functionality
    }, []);

    const handleSave = useCallback(async (postId: string) => {
        // Handle save functionality
    }, []);

    const handleShare = useCallback((postId: string) => {
        // Implement share functionality
    }, []);

    const handleComment = useCallback((postId: string) => {
        setActiveCommentId(activeCommentId === postId ? null : postId);
    }, [activeCommentId]);

    const addComment = useCallback(async (postId: string, text: string) => {
        // Handle adding comments
    }, []);

    const renderItem = useCallback(({ item: post }: { item: any }) => (
        <View style={styles.postContainer}>
            <Post
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onSave={handleSave}
                onShare={handleShare}
            />
            
            {activeCommentId === post.id && (
                <Comments
                    postId={post.id}
                    comments={post.comments}
                    onAddComment={addComment}
                />
            )}
        </View>
    ), [handleLike, handleComment, handleSave, handleShare, activeCommentId, addComment]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {loading ? 'Loading highlights...' : 'No pinned posts yet'}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#1DA1F2" />
            </View>
        );
    };

    return (
        <FlatList
            data={pinnedPosts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#1DA1F2"
                    colors={['#1DA1F2']}
                />
            }
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={[
                styles.contentContainer,
                pinnedPosts.length === 0 && styles.emptyList
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
