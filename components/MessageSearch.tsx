import React, { useState, useCallback } from 'react';
import { 
    View, 
    TextInput, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    Text,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { debounce } from 'lodash';
import { format, isToday, isYesterday, isSameWeek } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';

interface MessageSearchProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    results: Message[];
    onResultPress: (message: Message) => void;
    loading?: boolean;
    error?: string;
}

interface SearchFilters {
    type?: 'all' | 'text' | 'media' | 'files';
    dateRange?: 'all' | 'today' | 'week' | 'month';
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
    onSearch,
    results,
    onResultPress,
    loading = false,
    error
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({
        type: 'all',
        dateRange: 'all'
    });

    const debouncedSearch = useCallback(
        debounce((query: string, searchFilters: SearchFilters) => {
            onSearch(query, searchFilters);
        }, 300),
        []
    );

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        debouncedSearch(text, filters);
    };

    const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        debouncedSearch(searchQuery, updatedFilters);
    };

    const getMessagePreview = (message: Message) => {
        switch (message.type) {
            case 'image':
                return '📷 Image';
            case 'file':
                return `📎 ${message.fileName || 'File'}`;
            case 'voice':
                return '🎤 Voice Message';
            default:
                return message.content;
        }
    };

    const formatMessageDate = (timestamp: string) => {
        const date = new Date(timestamp);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else if (isSameWeek(date, new Date())) {
            return format(date, 'EEEE');
        } else {
            return format(date, 'MMM d, yyyy');
        }
    };

    const renderFilterChip = (
        label: string, 
        value: string, 
        filterKey: keyof SearchFilters
    ) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                filters[filterKey] === value && styles.filterChipActive
            ]}
            onPress={() => handleFilterChange({ [filterKey]: value })}
        >
            <Text style={[
                styles.filterChipText,
                filters[filterKey] === value && styles.filterChipTextActive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity 
                        onPress={() => handleSearch('')}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.filterGroup}>
                        {renderFilterChip('All', 'all', 'type')}
                        {renderFilterChip('Text', 'text', 'type')}
                        {renderFilterChip('Media', 'media', 'type')}
                        {renderFilterChip('Files', 'files', 'type')}
                    </View>
                    <View style={styles.filterGroup}>
                        {renderFilterChip('Any time', 'all', 'dateRange')}
                        {renderFilterChip('Today', 'today', 'dateRange')}
                        {renderFilterChip('This week', 'week', 'dateRange')}
                        {renderFilterChip('This month', 'month', 'dateRange')}
                    </View>
                </ScrollView>
            </View>

            {error ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : results.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="search" size={24} color="#666" />
                    <Text style={styles.emptyText}>
                        {searchQuery ? 'No messages found' : 'Search for messages'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() => onResultPress(item)}
                        >
                            <View style={styles.resultContent}>
                                <Text style={styles.resultText} numberOfLines={2}>
                                    {getMessagePreview(item)}
                                </Text>
                                <Text style={styles.resultDate}>
                                    {formatMessageDate(item.timestamp)}
                                </Text>
                            </View>
                            <Ionicons 
                                name="chevron-forward" 
                                size={20} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 12,
        margin: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
    filtersContainer: {
        marginBottom: 8,
    },
    filterGroup: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#007AFF',
    },
    filterChipText: {
        fontSize: 14,
        color: '#666',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        marginTop: 8,
        fontSize: 14,
        color: '#FF3B30',
        textAlign: 'center',
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E8E8E8',
    },
    resultContent: {
        flex: 1,
        marginRight: 8,
    },
    resultText: {
        fontSize: 16,
        marginBottom: 4,
    },
    resultDate: {
        fontSize: 12,
        color: '#666',
    },
});
