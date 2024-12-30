import React, { useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThreadPreview } from '../../components/ThreadPreview';
import { dummyThreads, dummyUsers } from '../../assets/utils/dummyData';

export default function MessagingScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredThreads = dummyThreads.filter((thread) => {
        const user = dummyUsers.find((u) => thread.participants.includes(u.id));
        return (
        user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.newMessageButton}>
                    <Ionicons name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredThreads}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const user = dummyUsers.find(
                        (u) => item.participants.find((p) => p === u.id) !== undefined
                    );
                    if (!user) return null;
                    
                    return (
                        <Link 
                            href={{
                                pathname: "/chat/[id]",
                                params: { 
                                    id: item.id,
                                    userId: user.id
                                }
                            }} 
                            asChild
                        >
                            <TouchableOpacity>
                                <ThreadPreview
                                    thread={item}
                                    user={user}
                                />
                            </TouchableOpacity>
                        </Link>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 8,
        marginRight: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    newMessageButton: {
        padding: 8,
    }
});
