import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinkPreview } from '../types';

interface LinkPreviewCardProps {
    preview: LinkPreview;
    onPress: () => void;
}

export const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({
    preview,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {preview.imageUrl && (
                <Image
                    source={{ uri: preview.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {preview.title}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                    {preview.description}
                </Text>
                <Text style={styles.url} numberOfLines={1}>
                    {preview.url}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        margin: 16,
    },
    image: {
        width: '100%',
        height: 150,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    url: {
        fontSize: 12,
        color: '#007AFF',
    },
});
