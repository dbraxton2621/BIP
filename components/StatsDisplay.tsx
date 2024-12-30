import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../types';

interface StatsDisplayProps {
    player: Player;
}

export default function StatsDisplay({ player }: StatsDisplayProps) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Player Statistics</Text>

        {player.passingStats && (
            <View style={styles.statSection}>
            <Text style={styles.sectionTitle}>Passing</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Yards</Text>
                </View>
                <Text style={styles.value}>{player.passingStats.yards}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Touchdowns</Text>
                </View>
                <Text style={styles.value}>{player.passingStats.touchdowns}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Interceptions</Text>
                </View>
                <Text style={styles.value}>{player.passingStats.interceptions}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>QB Rating</Text>
                </View>
                <Text style={styles.value}>{player.passingStats.quarterbackRating}</Text>
                </View>
            </View>
            </View>
        )}

        {player.rushingStats && (
            <View style={styles.statSection}>
            <Text style={styles.sectionTitle}>Rushing</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Carries</Text>
                </View>
                <Text style={styles.value}>{player.rushingStats.carries}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Yards</Text>
                </View>
                <Text style={styles.value}>{player.rushingStats.yards}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Touchdowns</Text>
                </View>
                <Text style={styles.value}>{player.rushingStats.touchdowns}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Average</Text>
                </View>
                <Text style={styles.value}>{player.rushingStats.average.toFixed(1)}</Text>
                </View>
            </View>
            </View>
        )}

        {player.receivingStats && (
            <View style={styles.statSection}>
            <Text style={styles.sectionTitle}>Receiving</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Receptions</Text>
                </View>
                <Text style={styles.value}>{player.receivingStats.receptions}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Yards</Text>
                </View>
                <Text style={styles.value}>{player.receivingStats.yards}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Touchdowns</Text>
                </View>
                <Text style={styles.value}>{player.receivingStats.touchdowns}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Average</Text>
                </View>
                <Text style={styles.value}>{player.receivingStats.average.toFixed(1)}</Text>
                </View>
            </View>
            </View>
        )}

        {player.defensiveStats && (
            <View style={styles.statSection}>
            <Text style={styles.sectionTitle}>Defense</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Solo Tackles</Text>
                </View>
                <Text style={styles.value}>{player.defensiveStats.soloTackles}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Sacks</Text>
                </View>
                <Text style={styles.value}>{player.defensiveStats.sacks}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Forced Fumbles</Text>
                </View>
                <Text style={styles.value}>{player.defensiveStats.forcedFumbles}</Text>
                </View>
                <View style={styles.statItem}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Interceptions</Text>
                </View>
                <Text style={styles.value}>{player.defensiveStats.interceptions}</Text>
                </View>
            </View>
            </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    statSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    statItem: {
        width: '25%',
        paddingHorizontal: 6,
        marginBottom: 16,
    },
    labelContainer: {
        height: 40, // Fixed height for label container
        justifyContent: 'flex-end', // Align label text to bottom
        paddingBottom: 4,
    },
    label: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
    },
    value: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
});
