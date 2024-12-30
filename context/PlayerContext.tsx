// context/PlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../types';

interface PlayerContextType {
    players: Player[];
    addPlayer: (player: Omit<Player, 'id' | 'createdAt' | 'lastUpdated'>) => Promise<void>;
    updatePlayer: (id: string, player: Partial<Player>) => Promise<void>;
    deletePlayer: (id: string) => Promise<void>;
    getPlayerById: (id: string) => Player | undefined;
    isLoading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STORAGE_KEY = 'football-eval-players';

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load players from storage on mount
    useEffect(() => {
        loadPlayers();
    }, []);

    const loadPlayers = async () => {
        try {
        const storedPlayers = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedPlayers) {
            setPlayers(JSON.parse(storedPlayers));
        }
        } catch (error) {
        console.error('Error loading players:', error);
        } finally {
        setIsLoading(false);
        }
    };

    const savePlayers = async (updatedPlayers: Player[]) => {
        try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayers));
        } catch (error) {
        console.error('Error saving players:', error);
        }
    };

    const addPlayer = async (playerData: Omit<Player, 'id' | 'createdAt' | 'lastUpdated'>) => {
        const timestamp = new Date().toISOString();
        const newPlayer: Player = {
        ...playerData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: timestamp,
        lastUpdated: timestamp,
        };

        const updatedPlayers = [...players, newPlayer];
        setPlayers(updatedPlayers);
        await savePlayers(updatedPlayers);
    };

    const updatePlayer = async (id: string, updates: Partial<Player>) => {
        const updatedPlayers = players.map(player => {
        if (player.id === id) {
            return {
            ...player,
            ...updates,
            lastUpdated: new Date().toISOString(),
            };
        }
        return player;
        });

        setPlayers(updatedPlayers);
        await savePlayers(updatedPlayers);
    };

    const deletePlayer = async (id: string) => {
        const updatedPlayers = players.filter(player => player.id !== id);
        setPlayers(updatedPlayers);
        await savePlayers(updatedPlayers);
    };

    const getPlayerById = (id: string) => {
        return players.find(player => player.id === id);
    };

    return (
        <PlayerContext.Provider 
        value={{ 
            players, 
            addPlayer, 
            updatePlayer, 
            deletePlayer, 
            getPlayerById,
            isLoading 
        }}
        >
        {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
