import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface EmptyStateProps {
    message: string;
    icon?: keyof typeof FontAwesome.glyphMap;
}

export default function EmptyState({ message, icon = 'users' }: EmptyStateProps) {
    return (
        <View style={styles.container}>
        <FontAwesome name={icon} size={48} color="#999" style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
