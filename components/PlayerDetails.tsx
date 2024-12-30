import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { usePlayer } from '../context/PlayerContext';
import StatsDisplay from './StatsDisplay';
import GradesChart from './GradesChart';
import MediaGallery from './MediaGallery';

interface PlayerDetailsProps {
    playerId: string;
}

export default function PlayerDetails({ playerId }: PlayerDetailsProps) {
    const { getPlayerById } = usePlayer();
    const player = getPlayerById(playerId);

    if (!player) {
        return (
        <View style={styles.container}>
            <Text>Player not found</Text>
        </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.editor}>
                <Link href={`/modal/edit-player/${playerId}`} asChild>
                    <TouchableOpacity style={[styles.button, styles.editButton]}>
                        <Text style={styles.buttonText}>Edit Player</Text>
                    </TouchableOpacity>
                </Link>
            </View>
            <View style={styles.topSection}>
                <Image 
                    source={{ uri: player.profileImage }} 
                    style={styles.profileImage}
                />
                
                <View style={styles.detailsContainer}>
                    <View style={styles.column}>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>First Name:</Text>
                            <Text style={styles.value}>{player.firstName}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Last Name:</Text>
                            <Text style={styles.value}>{player.lastName}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Position:</Text>
                            <Text style={styles.value}>{player.position}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Class:</Text>
                            <Text style={styles.value}>{player.class}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.column}>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>School:</Text>
                            <Text style={styles.value}>{player.school}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Height:</Text>
                            <Text style={styles.value}>{player.height}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Weight:</Text>
                            <Text style={styles.value}>{player.weight} lbs</Text>
                        </View>
                    </View>
                </View>
            </View>

            <GradesChart grades={player.grades} />
            
            <StatsDisplay player={player} />
            
            <MediaGallery media={player.media} />

            <View>
                <View style={styles.prosCons}>
                    <Text style={styles.prosConsTitle}>Pros</Text>
                    <Text style={styles.value}>{player.pros}</Text>
                </View>
                <View style={styles.prosCons}>
                    <Text style={styles.prosConsTitle}>Cons</Text>
                    <Text style={styles.value}>{player.cons}</Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    prosConsText: {
        color: 'black'
    },
    prosConsTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    prosCons: {
        marginBottom: 20,
        paddingLeft: 15
    },
    editor: {
        alignItems: 'flex-end',
        paddingRight: 15
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    topSection: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileImage: {
        width: '30%',
        height: 120,
        borderRadius: 50,
        marginRight: 15,
    },
    detailsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 30,
    },
    column: {
        flex: 1,
    },
    detailItem: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        color: '#333',
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    editButton: {
        backgroundColor: '#808080',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
