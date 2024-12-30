import React, { useState } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    ScrollView, 
    TouchableOpacity, 
    Text,
    Modal,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Media } from '../types';

interface MediaGalleryProps {
    media: Media[];
    onDeleteMedia?: (mediaId: string) => void;
}

export default function MediaGallery({ media, onDeleteMedia }: MediaGalleryProps) {
    const [videoStatus, setVideoStatus] = useState({});
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const handleVideoStatus = (status: any, mediaId: string) => {
        setVideoStatus(prev => ({
            ...prev,
            [mediaId]: status
        }));
    };

    const handleMediaPress = (item: Media) => {
        setSelectedMedia(item);
    };

    const renderModalContent = () => {
        if (!selectedMedia) return null;

        return selectedMedia.type === 'image' ? (
            <Image
                source={{ uri: selectedMedia.uri }}
                style={styles.modalMedia}
                resizeMode="contain"
            />
        ) : (
            <Video
                source={{ uri: selectedMedia.uri }}
                style={styles.modalMedia}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
            />
        );
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Media Gallery</Text>
            <ScrollView horizontal style={styles.container}>
                {media.map((item) => (
                    <View key={item.id} style={styles.mediaContainer}>
                        <TouchableOpacity onPress={() => handleMediaPress(item)}>
                            {item.type === 'image' ? (
                                <Image
                                    source={{ uri: item.uri }}
                                    style={styles.mediaItem}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Video
                                    source={{ uri: item.uri }}
                                    style={styles.mediaItem}
                                    useNativeControls
                                    resizeMode={ResizeMode.COVER}
                                    onPlaybackStatusUpdate={(status) => handleVideoStatus(status, item.id)}
                                    isLooping
                                />
                            )}
                        </TouchableOpacity>
                        {item.notes && (
                            <Text style={styles.notes} numberOfLines={2}>
                                {item.notes}
                            </Text>
                        )}
                        {onDeleteMedia && (
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => onDeleteMedia(item.id)}
                            >
                                <Text style={styles.deleteText}>×</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={!!selectedMedia}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedMedia(null)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedMedia(null)}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                    {renderModalContent()}
                    {selectedMedia?.notes && (
                        <Text style={styles.modalNotes}>
                            {selectedMedia.notes}
                        </Text>
                    )}
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 8,
        color: '#333',
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    mediaContainer: {
        marginRight: 12,
        position: 'relative',
    },
    mediaItem: {
        width: 120,
        height: 120,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    notes: {
        fontSize: 11,
        color: '#666',
        marginTop: 3,
        maxWidth: 120,
    },
    deleteButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalMedia: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.7,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalNotes: {
        color: 'white',
        fontSize: 14,
        marginTop: 16,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
});
