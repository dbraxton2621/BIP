import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';

interface MessageMediaProps {
    message: Message;
}

export const MessageMedia: React.FC<MessageMediaProps> = ({ message }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (message.type === 'image') {
        return (
            <View style={styles.mediaContainer}>
                <TouchableOpacity 
                    onPress={() => {/* TODO: Implement full-screen preview */}}
                    style={styles.imageContainer}
                >
                    <Image
                        source={{ uri: message.mediaUrl }}
                        style={styles.image}
                        resizeMode="cover"
                        onLoadStart={() => {
                            setLoading(true);
                            setError(false);
                        }}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                    />
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#007AFF" />
                        </View>
                    )}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                            <Text style={styles.errorText}>Failed to load image</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    if (message.type === 'file') {
        return (
            <TouchableOpacity
                style={styles.fileContainer}
                onPress={() => {
                    if (message.mediaUrl) {
                        Linking.openURL(message.mediaUrl).catch((error: Error) => 
                            console.error('Error opening file:', error)
                        );
                    }
                }}
            >
                <View style={styles.fileContent}>
                    <Ionicons name="document" size={24} color="#007AFF" />
                    <View style={styles.fileInfo}>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {message.fileName || 'Unnamed file'}
                        </Text>
                        {message.mediaType && (
                            <Text style={styles.fileType}>
                                {message.mediaType.toUpperCase()}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    if (message.type === 'voice') {
        return (
            <View style={styles.voiceContainer}>
                <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={24} color="#007AFF" />
                </TouchableOpacity>
                <View style={styles.voiceInfo}>
                    <View style={styles.waveform}>
                        {/* TODO: Implement waveform visualization */}
                        <View style={styles.waveformPlaceholder} />
                    </View>
                    <Text style={styles.duration}>
                        {message.duration ? `${Math.round(message.duration)}s` : '--:--'}
                    </Text>
                </View>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    mediaContainer: {
        marginBottom: 8,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    errorText: {
        color: '#FF3B30',
        marginTop: 4,
        fontSize: 12,
    },
    fileContainer: {
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    fileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileInfo: {
        marginLeft: 12,
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 2,
    },
    fileType: {
        fontSize: 12,
        color: '#8E8E93',
    },
    voiceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 20,
        padding: 8,
        marginBottom: 8,
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    voiceInfo: {
        flex: 1,
    },
    waveform: {
        height: 24,
        justifyContent: 'center',
    },
    waveformPlaceholder: {
        height: 2,
        backgroundColor: '#007AFF',
        opacity: 0.5,
    },
    duration: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 4,
    },
});
