// RepliesList.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHighlights } from '../context/HighlightsContext';

interface Reply {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
    originalPost: {
        id: string;
        text: string;
        username: string;
    };
    likes: number;
    isLiked: boolean;
    allowComments: boolean;
}

interface RepliesListProps {
    userId?: string;
    onReplyPress?: (replyId: string) => void;
    onOriginalPostPress?: (postId: string) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export default function RepliesList({
    userId,
    onReplyPress,
    onOriginalPostPress,
    ListHeaderComponent
}: RepliesListProps) {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedReply, setSelectedReply] = useState<Reply | null>(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState('');
    const { addToHighlights } = useHighlights();

    const fetchReplies = useCallback(async (pageNum: number, refresh = false) => {
        try {
            setLoading(true);
            // Simulated response with mock data
            const mockReplies: Reply[] = [
                {
                    id: '1',
                    userId: 'user1',
                    username: 'JohnDoe',
                    text: "LeBron's performance in the fourth quarter was incredible. His court vision and basketball IQ are unmatched.",
                    timestamp: new Date(2024, 0, 15, 20, 30),
                    originalPost: {
                        id: 'op1',
                        text: "Just watched the Lakers game. LeBron James with another triple-double at 39 years old! 🐐",
                        username: "BasketballFanatic"
                    },
                    likes: 24,
                    isLiked: false,
                    allowComments: true
                },
                {
                    id: '2',
                    userId: 'user2',
                    username: 'HoopsAnalyst',
                    text: "The defensive adjustments in the second half were key. Switching on screens and better help defense completely changed the game.",
                    timestamp: new Date(2024, 0, 15, 19, 45),
                    originalPost: {
                        id: 'op2',
                        text: "Breaking down the Celtics' defensive strategy tonight. Their help defense is elite.",
                        username: "NBAStrategy"
                    },
                    likes: 18,
                    isLiked: true,
                    allowComments: true
                },
            ];
            
            if (refresh) {
                setReplies(mockReplies);
            } else {
                setReplies(prev => [...prev, ...mockReplies]);
            }
            
            setHasMore(mockReplies.length === 10);
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchReplies(1, true);
    }, [fetchReplies]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        await fetchReplies(1, true);
        setRefreshing(false);
    }, [fetchReplies]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchReplies(nextPage);
        }
    }, [loading, hasMore, page, fetchReplies]);

    const handleLike = useCallback(async (replyId: string) => {
        try {
            setReplies(currentReplies =>
                currentReplies.map(reply =>
                    reply.id === replyId
                        ? {
                            ...reply,
                            isLiked: !reply.isLiked,
                            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                        }
                        : reply
                )
            );
        } catch (error) {
            console.error('Error liking reply:', error);
        }
    }, []);

    const handleOptionsPress = useCallback((reply: Reply) => {
        setSelectedReply(reply);
        setEditText(reply.text);
        setShowOptionsModal(true);
    }, []);

    const handleToggleComments = useCallback(() => {
        if (!selectedReply) return;
        setReplies(currentReplies =>
            currentReplies.map(reply =>
                reply.id === selectedReply.id
                    ? { ...reply, allowComments: !reply.allowComments }
                    : reply
            )
        );
        setShowOptionsModal(false);
    }, [selectedReply]);

    const handleEditSubmit = useCallback(() => {
        if (!selectedReply) return;
        setReplies(currentReplies =>
            currentReplies.map(reply =>
                reply.id === selectedReply.id
                    ? { ...reply, text: editText }
                    : reply
            )
        );
        setEditMode(false);
        setShowOptionsModal(false);
    }, [selectedReply, editText]);

    const handleAddToHighlights = useCallback(() => {
        if (!selectedReply) return;
        
        // Convert Reply to Post format
        const post = {
            id: selectedReply.id,
            userId: selectedReply.userId,
            username: selectedReply.username,
            content: selectedReply.text,
            timestamp: selectedReply.timestamp,
            likes: selectedReply.likes,
            comments: [], // Initialize with empty comments array
            isLiked: selectedReply.isLiked,
            isSaved: false, // Default value
        };
        
        // Add to highlights using context
        addToHighlights(post);
        setShowOptionsModal(false);
    }, [selectedReply, addToHighlights]);

    const handleDelete = useCallback(() => {
        if (!selectedReply) return;
        setReplies(currentReplies =>
            currentReplies.filter(reply => reply.id !== selectedReply.id)
        );
        setShowOptionsModal(false);
    }, [selectedReply]);

    const formatTimestamp = (timestamp: Date) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const renderReply = useCallback(({ item: reply }: { item: Reply }) => (
        <TouchableOpacity
            style={styles.replyContainer}
            onPress={() => onReplyPress?.(reply.id)}
        >
            <View style={styles.replyHeader}>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{reply.username}</Text>
                    <Text style={styles.timestamp}>{formatTimestamp(reply.timestamp)}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.likeButton}
                        onPress={() => handleLike(reply.id)}
                    >
                        <Feather
                            name={reply.isLiked ? "heart" : "heart"}
                            size={16}
                            color={reply.isLiked ? "#FF3B30" : "#657786"}
                        />
                        {reply.likes > 0 && (
                            <Text style={styles.likeCount}>{reply.likes}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionsButton}
                        onPress={() => handleOptionsPress(reply)}
                    >
                        <Feather name="more-horizontal" size={20} color="#657786" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.originalPost}
                onPress={() => onOriginalPostPress?.(reply.originalPost.id)}
            >
                <Text style={styles.replyingTo}>
                    Replying to <Text style={styles.originalUsername}>@{reply.originalPost.username}</Text>
                </Text>
                <Text style={styles.originalText} numberOfLines={2}>
                    {reply.originalPost.text}
                </Text>
            </TouchableOpacity>

            <Text style={styles.replyText}>{reply.text}</Text>
        </TouchableOpacity>
    ), [handleLike, onReplyPress, onOriginalPostPress, handleOptionsPress]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {loading ? 'Loading replies...' : 'No replies yet'}
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
                data={replies}
                renderItem={renderReply}
                keyExtractor={item => item.id}
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
                    replies.length === 0 && styles.emptyList
                ]}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            />

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
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleToggleComments}
                        >
                            <Feather
                                name={selectedReply?.allowComments ? "message-circle" : "message-circle"}
                                size={20}
                                color="#657786"
                            />
                            <Text style={styles.modalOptionText}>
                                {selectedReply?.allowComments ? 'Disable' : 'Enable'} Comments
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                setEditMode(true);
                                setShowOptionsModal(false);
                            }}
                        >
                            <Feather name="edit-2" size={20} color="#657786" />
                            <Text style={styles.modalOptionText}>Edit Reply</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleAddToHighlights}
                        >
                            <Feather name="star" size={20} color="#657786" />
                            <Text style={styles.modalOptionText}>Add to Highlights</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalOption, styles.deleteOption]}
                            onPress={handleDelete}
                        >
                            <Feather name="trash-2" size={20} color="#FF3B30" />
                            <Text style={[styles.modalOptionText, styles.deleteText]}>Delete Reply</Text>
                        </TouchableOpacity>
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
                        <Text style={styles.editTitle}>Edit Reply</Text>
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
    replyContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    replyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#14171A',
    },
    timestamp: {
        fontSize: 14,
        color: '#657786',
        marginTop: 2,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    optionsButton: {
        padding: 4,
    },
    likeCount: {
        fontSize: 14,
        color: '#657786',
    },
    originalPost: {
        backgroundColor: '#F5F8FA',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    replyingTo: {
        fontSize: 14,
        color: '#657786',
        marginBottom: 4,
    },
    originalUsername: {
        color: '#1DA1F2',
    },
    originalText: {
        fontSize: 14,
        color: '#14171A',
    },
    replyText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#14171A',
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
