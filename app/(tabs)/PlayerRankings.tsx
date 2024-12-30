import React, { useState, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { usePlayer } from '../../context/PlayerContext';
import PlayerListItem from '../../components/PlayerListItem';
import FilterBar from '../../components/FilterBar';
import EmptyState from '../../components/EmptyState';
import { Position, Class, PlayerGrades } from '../../types';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default function PlayersScreen() {
    const { players, deletePlayer } = usePlayer();
    const [positionFilter, setPositionFilter] = useState<Position | 'All'>('All');
    const [classFilter, setClassFilter] = useState<Class | 'All'>('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    // Keep track of open swipeable
    const swipeableRef = useRef<Swipeable | null>(null);

    const calculateOverallGrade = (grades: PlayerGrades) => {
        const { alignment, assignment, technique, intangibles } = grades;
        return Number(((alignment + assignment + technique + intangibles) / 4).toFixed(1));
    };

    const filteredPlayers = players
        .filter(player => 
        (positionFilter === 'All' || player.position === positionFilter) &&
        (classFilter === 'All' || player.class === classFilter)
        )
        .sort((a, b) => {
        const aGrade = calculateOverallGrade(a.grades);
        const bGrade = calculateOverallGrade(b.grades);
        return sortOrder === 'asc' ? aGrade - bGrade : bGrade - aGrade;
        });

    const handleDelete = (playerId: string) => {
        deletePlayer(playerId);
        if (swipeableRef.current) {
        swipeableRef.current.close();
        }
    };

    const renderRightActions = (playerId: string) => {
        return (
        <View style={styles.deleteContainer}>
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(playerId)}
            >
            <FontAwesome name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        );
    };

    if (players.length === 0) {
        return (
        <View style={styles.container}>
            <EmptyState 
            message="No players added yet. Tap the + button to add your first player."
            icon="users"
            />
            <Link href="/modal/new-player" asChild>
            <TouchableOpacity style={styles.addButton}>
                <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>
            </Link>
        </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
        <View style={styles.filterContainer}>
            <FilterBar
            positionFilter={positionFilter}
            classFilter={classFilter}
            sortOrder={sortOrder}
            onPositionChange={setPositionFilter}
            onClassChange={setClassFilter}
            onSortOrderChange={setSortOrder}
            />
        </View>
        
        <FlatList
            data={filteredPlayers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <Swipeable
                ref={swipeableRef}
                renderRightActions={() => renderRightActions(item.id)}
                friction={2}
                rightThreshold={40}
            >
                <Link href={`/player/${item.id}`} asChild>
                <TouchableOpacity>
                    <PlayerListItem player={item} />
                </TouchableOpacity>
                </Link>
            </Swipeable>
            )}
            contentContainerStyle={styles.listContainer}
        />
        
        <Link href="/modal/new-player" asChild>
            <TouchableOpacity style={styles.addButton}>
            <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </Link>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    filterContainer: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    listContainer: {
        paddingBottom: 80,
    },
    deleteContainer: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: 'gray',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
