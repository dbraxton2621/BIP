import React, { useState, useMemo } from 'react';
import { 
    View, 
    FlatList, 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    Image, 
    TextInput,
    ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message, User } from '../types';

interface MessageForwardProps {
    message: Message;
    contacts: User[];
    onForward: (userIds: string[]) => void;
    onClose: () => void;
    loading?: boolean;
}

export const MessageForward: React.FC<MessageForwardProps> = ({
    message,
    contacts,
    onForward,
    onClose,
    loading = false
}) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [contacts, searchQuery]);

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleForward = () => {
        if (selectedUsers.length > 0 && !loading) {
            onForward(selectedUsers);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Forward Message</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.messagePreview}>
                <Text style={styles.previewLabel}>Message Preview</Text>
                <View style={styles.previewContent}>
                    {message.type !== 'text' && (
                        <Ionicons 
                            name={
                                message.type === 'image' ? 'image' :
                                message.type === 'file' ? 'document' :
                                'mic'
                            } 
                            size={20} 
                            color="#666" 
                            style={styles.previewIcon}
                        />
                    )}
                    <Text style={styles.previewText} numberOfLines={2}>
                        {message.content}
                    </Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                />
            </View>

            <Text style={styles.sectionHeader}>
                {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'}
            </Text>

            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => toggleUser(item.id)}
                        disabled={loading}
                    >
                        <Image 
                            source={{ uri: item.avatar }} 
                            style={styles.avatar}
                            defaultSource={require('../assets/images/default-avatar.png')}
                        />
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactName}>{item.name}</Text>
                            <Text style={styles.lastSeen}>
                                Last seen {item.lastSeen}
                            </Text>
                        </View>
                        {selectedUsers.includes(item.id) && (
                            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No contacts found' : 'No contacts available'}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[
                    styles.forwardButton,
                    { opacity: selectedUsers.length > 0 && !loading ? 1 : 0.5 },
                ]}
                onPress={handleForward}
                disabled={selectedUsers.length === 0 || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.forwardButtonText}>
                        Forward to {selectedUsers.length} {selectedUsers.length === 1 ? 'contact' : 'contacts'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    messagePreview: {
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    previewLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    previewContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewIcon: {
        marginRight: 8,
    },
    previewText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f0f0f0',
        margin: 16,
        borderRadius: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 14,
        color: '#666',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        marginBottom: 2,
    },
    lastSeen: {
        fontSize: 12,
        color: '#666',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    forwardButton: {
        backgroundColor: '#007AFF',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    forwardButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
