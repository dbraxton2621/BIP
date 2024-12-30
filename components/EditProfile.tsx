// EditProfile.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

interface ProfileData {
    name: string;
    tag: string;
    bio: string;
    location: string;
    website: string;
    profileImage: string;
    headerImage: string;
}

interface EditProfileProps {
    initialData: ProfileData;
    onSave: (data: ProfileData) => void;
    onCancel: () => void;
}

export default function EditProfile({ initialData, onSave, onCancel }: EditProfileProps) {
    const [profileData, setProfileData] = useState<ProfileData>(initialData);

    useEffect(() => {
        setProfileData(initialData);
    }, [initialData]);

    const pickImage = async (type: 'profile' | 'header') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'profile' ? [1, 1] : [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            const update = type === 'profile' 
                ? { profileImage: result.assets[0].uri }
                : { headerImage: result.assets[0].uri };
            setProfileData({ ...profileData, ...update });
        }
    };

    const handleSave = async () => {
        try {
            onSave(profileData);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                        <Feather name="x" size={24} color="#657786" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.container}>
                    {/* Header Image */}
                    <TouchableOpacity 
                        style={styles.headerImageContainer}
                        onPress={() => pickImage('header')}
                    >
                        {profileData.headerImage ? (
                            <Image
                                source={{ uri: profileData.headerImage }}
                                style={styles.headerImage}
                            />
                        ) : (
                            <View style={styles.headerImagePlaceholder}>
                                <Feather name="camera" size={24} color="#657786" />
                                <Text style={styles.placeholderText}>Add header photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Profile Image */}
                    <TouchableOpacity 
                        style={styles.profileImageContainer}
                        onPress={() => pickImage('profile')}
                    >
                        {profileData.profileImage ? (
                            <Image
                                source={{ uri: profileData.profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Feather name="user" size={24} color="#657786" />
                            </View>
                        )}
                        <View style={styles.cameraIcon}>
                            <Feather name="camera" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.name}
                                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                                placeholder="Your name"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Handle/Tag</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.tag}
                                onChangeText={(text) => setProfileData({ ...profileData, tag: text })}
                                placeholder="@yourtag"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                value={profileData.bio}
                                onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                                placeholder="Tell us about yourself"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.location}
                                onChangeText={(text) => setProfileData({ ...profileData, location: text })}
                                placeholder="Your location"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Website</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.website}
                                onChangeText={(text) => setProfileData({ ...profileData, website: text })}
                                placeholder="Your website"
                                keyboardType="url"
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 24, // Added more top padding
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 8, // Increased padding for better touch target
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerImageContainer: {
        height: 150,
        width: '100%',
        backgroundColor: '#e1e8ed',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        marginTop: -40,
        marginLeft: 16,
        position: 'relative',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e1e8ed',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1DA1F2',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#657786',
        marginTop: 8,
    },
    form: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#14171A',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e1e8ed',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#1DA1F2',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
