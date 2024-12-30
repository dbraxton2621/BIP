// TabContent.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { Post as PostComponent } from './Post';
import { Post, Comment } from './../types';

// PostsList Component - Shows analyst's posts and player reviews
export const PostsList = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchPosts = async () => {
        try {
        // Implement your API call here
        // const response = await api.getPosts(page);
        // setPosts(prevPosts => [...prevPosts, ...response.data]);
        } catch (error) {
        console.error('Error fetching posts:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchPosts();
        setRefreshing(false);
    };

    const handleLoadMore = async () => {
        if (!loading) {
        setLoading(true);
        setPage(prev => prev + 1);
        await fetchPosts();
        setLoading(false);
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
        <View style={styles.loader}>
            <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
        );
    };

    return (
        <FlatList
        data={posts}
        renderItem={({ item }) => (
            <PostComponent
            post={item}
            onLike={(id) => {/* implement like logic */}}
            onComment={(id) => {/* implement comment logic */}}
            onSave={(id) => {/* implement save logic */}}
            onShare={(id) => {/* implement share logic */}}
            />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
            <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            </View>
        }
        />
    );
};

// RepliesList Component - Shows analyst's replies to other posts
export const RepliesList = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchReplies = async () => {
        try {
        // Implement your API call here
        // const response = await api.getReplies(page);
        // setReplies(prevReplies => [...prevReplies, ...response.data]);
        } catch (error) {
        console.error('Error fetching replies:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchReplies();
        setRefreshing(false);
    };

    return (
        <FlatList
        data={replies}
        renderItem={({ item }) => (
            <View style={styles.replyContainer}>
            <View style={styles.replyHeader}>
                <Text style={styles.replyUsername}>{item.username}</Text>
                <Text style={styles.replyTimestamp}>
                {new Date(item.timestamp).toLocaleDateString()}
                </Text>
            </View>
            <Text style={styles.replyText}>{item.text}</Text>
            </View>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
            <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            />
        }
        contentContainerStyle={styles.container}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No replies yet</Text>
            </View>
        }
        />
    );
};

// HighlightsList Component - Shows pinned posts
export const HighlightsList = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [pinnedPosts, setPinnedPosts] = useState<Post[]>([]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
        // Implement your API call here
        // const response = await api.getPinnedPosts();
        // setPinnedPosts(response.data);
        } catch (error) {
        console.error('Error fetching pinned posts:', error);
        }
        setRefreshing(false);
    };

    return (
        <FlatList
        data={pinnedPosts}
        renderItem={({ item }) => (
            <PostComponent
            post={item}
            onLike={(id) => {/* implement like logic */}}
            onComment={(id) => {/* implement comment logic */}}
            onSave={(id) => {/* implement save logic */}}
            onShare={(id) => {/* implement share logic */}}
            />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
            <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            />
        }
        contentContainerStyle={styles.container}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pinned posts yet</Text>
            </View>
        }
        />
    );
};

// MediaList Component - Shows media posts
export const MediaList = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [media, setMedia] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchMedia = async () => {
        try {
        // Implement your API call here
        // const response = await api.getMediaPosts(page);
        // setMedia(prevMedia => [...prevMedia, ...response.data]);
        } catch (error) {
        console.error('Error fetching media:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchMedia();
        setRefreshing(false);
    };

    const handleLoadMore = async () => {
        if (!loading) {
        setLoading(true);
        setPage(prev => prev + 1);
        await fetchMedia();
        setLoading(false);
        }
    };

    return (
        <FlatList
        data={media}
        renderItem={({ item }) => (
            <PostComponent
            post={item}
            onLike={(id) => {/* implement like logic */}}
            onComment={(id) => {/* implement comment logic */}}
            onSave={(id) => {/* implement save logic */}}
            onShare={(id) => {/* implement share logic */}}
            />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
            <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
            />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No media posts yet</Text>
            </View>
        }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    loader: {
        marginVertical: 16,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#657786',
    },
    replyContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
        backgroundColor: '#fff',
    },
    replyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    replyUsername: {
        fontWeight: '600',
        fontSize: 16,
        color: '#14171A',
    },
    replyTimestamp: {
        fontSize: 14,
        color: '#657786',
    },
    replyText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#14171A',
    },
});