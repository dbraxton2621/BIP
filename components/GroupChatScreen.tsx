import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message, User, GroupChat } from './../types'

interface GroupChatScreenProps {
    route: {
        params: {
        groupId: string;
        };
    };
    navigation: any;
}

export const GroupChatScreen: React.FC<GroupChatScreenProps> = ({
    route,
    navigation,
    }) => {
    const [group, setGroup] = useState<GroupChat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [participants, setParticipants] = useState<User[]>([]);

    useEffect(() => {
        // Fetch group details, messages, and participants
        // In a real app, this would be an API call
    }, [route.params.groupId]);

    const handleAddParticipant = () => {
        // Navigate to participant selection screen
        navigation.navigate('AddParticipants', { groupId: route.params.groupId });
    };

    return (
        <View style={styles.container}>
        <View style={styles.groupHeader}>
            <Image source={{ uri: group?.avatar }} style={styles.groupAvatar} />
            <Text style={styles.groupName}>{group?.name}</Text>
            <TouchableOpacity onPress={handleAddParticipant}>
            <Ionicons name="person-add" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
        
        {/* Rest of the chat interface similar to ChatScreen */}
        </View>
    );
};

const styles = StyleSheet.create({
  // ... existing styles ...
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    recordButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButtonInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    duration: {
        fontSize: 12,
        color: '#FF3B30',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactionsList: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
    },
    reactionItem: {
        padding: 8,
    },
    reactionEmoji: {
        fontSize: 24,
    },
    existingReactions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 8,
        margin: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    resultItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    resultText: {
        fontSize: 16,
    },
    resultDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    groupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    groupAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    groupName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
    },
});