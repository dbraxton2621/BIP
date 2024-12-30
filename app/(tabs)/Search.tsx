import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import MediaList from '../../components/MediaList';

interface Profile {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
}

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const searchProfiles = useCallback((text: string) => {
        // Simulated profile search results
        const mockProfiles: Profile[] = [
            {
                id: '1',
                username: 'lebron',
                name: 'LeBron James',
                avatarUrl: 'https://picsum.photos/100/100',
                bio: 'Lakers Forward | 4x NBA Champion',
            },
            {
                id: '2',
                username: 'stephcurry30',
                name: 'Stephen Curry',
                avatarUrl: 'https://picsum.photos/101/101',
                bio: 'Warriors Guard | 4x NBA Champion',
            },
            // Add more mock profiles as needed
        ];

        // Filter profiles based on search text
        const filtered = mockProfiles.filter(profile =>
            profile.username.toLowerCase().includes(text.toLowerCase()) ||
            profile.name.toLowerCase().includes(text.toLowerCase())
        );

        setProfiles(filtered);
    }, []);

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        if (text.length > 0) {
            searchProfiles(text);
        } else {
            setProfiles([]);
        }
    };

    const renderProfileItem = ({ item }: { item: Profile }) => (
        <TouchableOpacity style={styles.profileItem}>
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            <View style={styles.profileInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>@{item.username}</Text>
                <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search profiles or explore media..."
                    value={searchText}
                    onChangeText={handleSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            
            {searchText.length > 0 ? (
                <FlatList
                    data={profiles}
                    renderItem={renderProfileItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.profileList}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No profiles found</Text>
                        </View>
                    )}
                />
            ) : (
                <MediaList />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    searchInput: {
        height: 40,
        backgroundColor: '#F5F8FA',
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    profileList: {
        flexGrow: 1,
    },
    profileItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    username: {
        fontSize: 14,
        color: '#657786',
        marginBottom: 4,
    },
    bio: {
        fontSize: 14,
        color: '#14171A',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#657786',
    },
});
