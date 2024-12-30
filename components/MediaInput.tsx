import React, { useState } from 'react';
import { 
    View, 
    TouchableOpacity,
    StyleSheet, 
    Alert,
    ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { Media } from '../types';

interface MediaInputProps {
    onMediaSelect: (newMedia: Media) => void;
    isLoading?: boolean;
}

export default function MediaInput({ onMediaSelect, isLoading = false }: MediaInputProps) {
    const [uploading, setUploading] = useState(false);

    const requestPermissions = async () => {
        const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (imageStatus !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Sorry, we need camera roll permissions to upload media.'
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        if (!await requestPermissions()) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                handleMediaSelection({
                    id: Date.now().toString(),
                    type: 'image',
                    uri: asset.uri,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error(error);
        }
    };

    const pickGif = async () => {
        // TODO: Implement GIF picker functionality
        Alert.alert('Coming Soon', 'GIF picker will be available soon!');
    };

    const handleMediaSelection = async (mediaItem: Media) => {
        setUploading(true);
        try {
            // Here you would typically upload the media to your backend
            // For now, we'll just simulate a delay and pass the local URI
            await new Promise(resolve => setTimeout(resolve, 1000));
            onMediaSelect(mediaItem);
        } catch (error) {
            Alert.alert('Error', 'Failed to upload media');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    if (isLoading || uploading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={pickImage}
                >
                    <FontAwesome name="image" size={24} color="#1DA1F2" />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={pickGif}
                >
                    <FontAwesome name="gift" size={24} color="#1DA1F2" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="list" size={24} color="#1DA1F2" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="smile-o" size={24} color="#1DA1F2" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginRight: 20,
    },
});
