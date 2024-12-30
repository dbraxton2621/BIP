import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Player } from '../types';
import Colors from '../constants/Colors';

interface PlayerListItemProps {
    player: Player;
}

export default function PlayerListItem({ player }: PlayerListItemProps) {
    const calculateOverallGrade = () => {
        const { alignment, assignment, technique, intangibles } = player.grades;
        return ((alignment + assignment + technique + intangibles) / 4).toFixed(1);
    };

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: player.profileImage }} 
                style={styles.image}
            />
            <View style={styles.details}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{player.firstName}</Text>
                    <Text> </Text>
                    <Text style={styles.name}>{player.lastName}</Text>
                </View>
                <Text style={styles.info}>
                    {player.position} • {player.class}
                </Text>
                <Text style={styles.school}>{player.school}</Text>
            </View>
            <View style={styles.gradeContainer}>
                <Text style={styles.grade}>{calculateOverallGrade()}</Text>
                <Text style={styles.gradeLabel}>Grade</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    nameContainer: {
        flexDirection: 'row'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginHorizontal: 8,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    info: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    school: {
        fontSize: 14,
        color: '#666',
    },
    gradeContainer: {
        alignItems: 'center',
        minWidth: 50,
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 8,
    },
    grade: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.tint,
    },
    gradeLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});
