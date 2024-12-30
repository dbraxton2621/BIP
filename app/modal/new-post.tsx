import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import MediaInput from '../../components/MediaInput';
import { Media } from '../../types';

export default function NewPostScreen() {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<Media[]>([]);
    const maxLength = 280;

    const handleMediaSelect = (newMedia: Media) => {
        setMedia([...media, newMedia]);
    };

    const handleRemoveMedia = (id: string) => {
        setMedia(media.filter(item => item.id !== id));
    };

    const handlePost = () => {
        // Create new post with content and media
        const newPost = {
            id: Date.now().toString(),
            userId: 'user123', // Replace with actual user ID
            username: 'username', // Replace with actual username
            content,
            media,
            timestamp: new Date(),
            likes: 0,
            comments: [],
            isLiked: false,
            isSaved: false,
            allowComments: true
        };

        // TODO: Send post to backend
        console.log('Creating post:', newPost);
        
        router.back();
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handlePost}
                    style={[styles.postButton, !content ? styles.postButtonDisabled : null]}
                    disabled={!content}
                >
                    <Text style={[styles.postButtonText, !content ? styles.postButtonTextDisabled : null]}>
                        Post
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <TextInput
                        style={styles.input}
                        placeholder="What's happening?"
                        placeholderTextColor="#657786"
                        multiline
                        value={content}
                        onChangeText={setContent}
                        maxLength={maxLength}
                        autoFocus
                    />

                    {media.length > 0 && (
                        <ScrollView horizontal style={styles.mediaPreviewContainer}>
                            {media.map((item) => (
                                <View key={item.id} style={styles.mediaPreview}>
                                    <Image 
                                        source={{ uri: item.uri }} 
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity 
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveMedia(item.id)}
                                    >
                                        <FontAwesome name="times-circle" size={24} color="#657786" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.mediaButtons}>
                    <MediaInput onMediaSelect={handleMediaSelect} />
                </View>
                <Text style={styles.characterCount}>
                    {content.length}/{maxLength}
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    scrollContainer: {
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    cancelText: {
        color: '#657786',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: '#1DA1F2',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        opacity: 0.5,
    },
    postButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    postButtonTextDisabled: {
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    input: {
        fontSize: 16,
        color: '#14171A',
        minHeight: 100,
    },
    mediaPreviewContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    mediaPreview: {
        marginRight: 10,
        position: 'relative',
    },
    previewImage: {
        width: 150,
        height: 150,
        borderRadius: 15,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderTopWidth: 0.5,
        borderTopColor: '#eee',
    },
    mediaButtons: {
        flex: 1,
    },
    characterCount: {
        color: '#657786',
        marginLeft: 15,
    },
});
