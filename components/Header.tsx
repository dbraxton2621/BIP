import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';

export default function Header() {
    return (
        <View style={styles.header}>
            <View style={styles.section}>
                <Image
                    source={require('../assets/images/icon.png')}
                    style={styles.profileImage}
                    contentFit="cover"
                />
            </View>
            
            <View style={[styles.section, styles.centerSection]}>
                <Image
                    source={require('../assets/images/logo.jpg')}
                    style={styles.logo}
                    contentFit="contain"
                />
            </View>
            
            <View style={[styles.section, styles.rightSection]}>
                <TouchableOpacity style={styles.upgradeButton}>
                    <Text style={styles.upgradeText}>Upgrade</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    section: {
        flex: 1,
    },
    centerSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    logo: {
        width: 120,
        height: 45,
    },
    upgradeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
    },
    upgradeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1DA1F2',
    },
});
