import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Position, PassingStats, RushingStats, ReceivingStats, DefensiveStats, StatsInputProps } from '../types';

export default function StatsInput({ position, stats, onChange }: StatsInputProps) {
    const handleStatChange = (
        category: 'passingStats' | 'rushingStats' | 'receivingStats' | 'defensiveStats',
        field: string,
        value: string
    ) => {
        const numValue = value === '' || value === '.' ? value : parseFloat(value) || 0;
        onChange({
        ...stats,
        [category]: {
            ...stats[category],
            [field]: numValue,
        },
        });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Player Statistics</Text>

        {position === 'QB' && (
            <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Passing Stats</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <Text style={styles.label}>Yards</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.passingStats?.yards?.toString()}
                    onChangeText={value => handleStatChange('passingStats', 'yards', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Touchdowns</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.passingStats?.touchdowns?.toString()}
                    onChangeText={value => handleStatChange('passingStats', 'touchdowns', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Interceptions</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.passingStats?.interceptions?.toString()}
                    onChangeText={value => handleStatChange('passingStats', 'interceptions', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>QB Rating</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.passingStats?.quarterbackRating?.toString()}
                    onChangeText={value => handleStatChange('passingStats', 'quarterbackRating', value)}
                    placeholder="0"
                />
                </View>
            </View>
            </View>
        )}

        {(position === 'RB' || position === 'QB') && (
            <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Rushing Stats</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <Text style={styles.label}>Carries</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.rushingStats?.carries?.toString()}
                    onChangeText={value => handleStatChange('rushingStats', 'carries', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Yards</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.rushingStats?.yards?.toString()}
                    onChangeText={value => handleStatChange('rushingStats', 'yards', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Touchdowns</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.rushingStats?.touchdowns?.toString()}
                    onChangeText={value => handleStatChange('rushingStats', 'touchdowns', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Average</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={stats.rushingStats?.average?.toString()}
                    onChangeText={value => handleStatChange('rushingStats', 'average', value)}
                    placeholder="0.0"
                />
                </View>
            </View>
            </View>
        )}

        {(position === 'WR' || position === 'TE' || position === 'RB') && (
            <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Receiving Stats</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <Text style={styles.label}>Receptions</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.receivingStats?.receptions?.toString()}
                    onChangeText={value => handleStatChange('receivingStats', 'receptions', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Yards</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.receivingStats?.yards?.toString()}
                    onChangeText={value => handleStatChange('receivingStats', 'yards', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Touchdowns</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.receivingStats?.touchdowns?.toString()}
                    onChangeText={value => handleStatChange('receivingStats', 'touchdowns', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Average</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={stats.receivingStats?.average?.toString()}
                    onChangeText={value => handleStatChange('receivingStats', 'average', value)}
                    placeholder="0.0"
                />
                </View>
            </View>
            </View>
        )}

        {(position === 'DL' || position === 'LB' || position === 'DB') && (
            <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Defensive Stats</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                <Text style={styles.label}>Solo Tackles</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.defensiveStats?.soloTackles?.toString()}
                    onChangeText={value => handleStatChange('defensiveStats', 'soloTackles', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Sacks</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.defensiveStats?.sacks?.toString()}
                    onChangeText={value => handleStatChange('defensiveStats', 'sacks', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Forced Fumbles</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.defensiveStats?.forcedFumbles?.toString()}
                    onChangeText={value => handleStatChange('defensiveStats', 'forcedFumbles', value)}
                    placeholder="0"
                />
                </View>
                <View style={styles.statItem}>
                <Text style={styles.label}>Interceptions</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stats.defensiveStats?.interceptions?.toString()}
                    onChangeText={value => handleStatChange('defensiveStats', 'interceptions', value)}
                    placeholder="0"
                />
                </View>
                </View>
            </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    statsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',  // Already enabled, keeping for reference
        marginHorizontal: -8,
    },
    statItem: {
        width: '50%',  // Keep at 50% for input component to maintain larger input areas
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 8,
        fontSize: 16,
    },
});
