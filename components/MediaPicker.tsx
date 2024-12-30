import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface MediaPickerProps {
    onMediaSelect: (media: { uri: string; type: string; name?: string }) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onMediaSelect }) => {
    useEffect(() => {
        (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to make this work!'
            );
        }
        })();
    }, []);

    const pickImage = async () => {
        try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            onMediaSelect({
            uri: result.assets[0].uri,
            type: 'image',
            });
        }
        } catch (error) {
        console.error('ImagePicker Error:', error);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const pickDocument = async () => {
        try {
        const result = await DocumentPicker.getDocumentAsync();

        if (result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            onMediaSelect({
            uri: asset.uri,
            type: 'file',
            name: asset.name,
            });
        }
        } catch (err) {
        console.error('DocumentPicker Error:', err);
        Alert.alert('Error', 'Failed to pick document. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
            <Ionicons name="document" size={24} color="#007AFF" />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
    },
    button: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
    },
});
