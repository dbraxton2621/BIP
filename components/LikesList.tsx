import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface LikesListProps {
    isVisible: boolean;
    onClose: () => void;
    likes: Array<{
        id: string;
        username: string;
    }>;
}

export const LikesList = ({ isVisible, onClose, likes }: LikesListProps) => {
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Likes</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#657786" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={likes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.userItem}>
                                <Text style={styles.username}>{item.username}</Text>
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    userItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
    },
});
