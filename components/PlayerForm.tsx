import React, { useState, useEffect } from 'react';
import { 
    View, 
    ScrollView, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Text,
    Alert,
    Platform,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { usePlayer } from '../context/PlayerContext';
import { Player, Position, Class, Media, PlayerGrades, PlayerFormProps } from '../types';
import StatsInput from './StatsInput';
import GradesInput from './GradesInput';
import MediaGallery from './MediaGallery';
import MediaInput from './MediaInput';

export default function PlayerForm({ playerId }: PlayerFormProps) {
    const router = useRouter();
    const { addPlayer, updatePlayer, getPlayerById } = usePlayer();
    const existingPlayer = playerId ? getPlayerById(playerId) : undefined;

    const [formData, setFormData] = useState<Partial<Player>>({
        firstName: '',
        lastName: '',
        position: 'QB',
        class: 'Freshman',
        school: '',
        height: '',
        weight: 0,
        profileImage: '',
        grades: {
            alignment: 0,
            assignment: 0,
            technique: 0,
            intangibles: 0,
        },
        pros: '',
        cons: '',
        media: [],
        ...existingPlayer
    });

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to upload images!');
            }
        })();
    }, []);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                profileImage: result.assets[0].uri
            }));
        }
    };

    const handleMediaSelect = (newMedia: Media) => {
        setFormData(prev => ({
            ...prev,
            media: [...(prev.media || []), newMedia]
        }));
    };

    const handleSubmit = async () => {
        try {
            if (playerId) {
                await updatePlayer(playerId, {
                    ...formData,
                    lastUpdated: new Date().toISOString()
                });
            } else {
                await addPlayer({
                    ...formData,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                } as Omit<Player, 'id'>);
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save player data');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView style={styles.container}>
                {formData.profileImage ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image 
                            source={{ uri: formData.profileImage }} 
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    </View>
                ) : null}

                <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                    <Text style={styles.imageButtonText}>
                        {formData.profileImage ? 'Change Profile Image' : 'Add Profile Image'}
                    </Text>
                </TouchableOpacity>

            <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={firstName => setFormData(prev => ({ ...prev, firstName }))}
                />
                </View>

                <View style={styles.halfWidth}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={lastName => setFormData(prev => ({ ...prev, lastName }))}
                />
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                        <Text style={styles.label}>Position</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                            selectedValue={formData.position}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            onValueChange={(position: Position) => 
                                setFormData(prev => ({ ...prev, position }))
                            }
                            >
                            <Picker.Item label="QB" value="QB" />
                            <Picker.Item label="RB" value="RB" />
                            <Picker.Item label="WR" value="WR" />
                            <Picker.Item label="TE" value="TE" />
                            <Picker.Item label="OL" value="OL" />
                            <Picker.Item label="DL" value="DL" />
                            <Picker.Item label="LB" value="LB" />
                            <Picker.Item label="DB" value="DB" />
                            <Picker.Item label="K" value="K" />
                            <Picker.Item label="P" value="P" />
                            </Picker>
                        </View>
                    </View>
                    
                    <View style={styles.halfWidth}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Class</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                            selectedValue={formData.class}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            onValueChange={(classYear: Class) => 
                                setFormData(prev => ({ ...prev, class: classYear }))
                            }
                            >
                            <Picker.Item label="Freshman" value="Freshman" />
                            <Picker.Item label="Sophomore" value="Sophomore" />
                            <Picker.Item label="Junior" value="Junior" />
                            <Picker.Item label="Senior" value="Senior" />
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={styles.label}>School</Text>
            <TextInput
                style={styles.input}
                placeholder="School"
                value={formData.school}
                onChangeText={school => setFormData(prev => ({ ...prev, school }))}
            />

            <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                    style={styles.input}
                    placeholder={"Height (e.g., 6'2\")"}
                    value={formData.height}
                    onChangeText={height => setFormData(prev => ({ ...prev, height }))}
                />
                </View>

                <View style={styles.halfWidth}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                style={styles.input}
                placeholder="Weight (lbs)"
                value={formData.weight?.toString()}
                keyboardType="numeric"
                onChangeText={weight => setFormData(prev => ({ ...prev, weight: parseInt(weight) || 0 }))}
                />
                </View>
            </View>

            {/* <MediaGallery media={formData.media} /> */}

            <GradesInput
            grades={formData.grades!}
            onChange={grades => setFormData(prev => ({ ...prev, grades }))}
            />

            <StatsInput
            position={formData.position!}
            stats={{
                passingStats: formData.passingStats,
                rushingStats: formData.rushingStats,
                receivingStats: formData.receivingStats,
                defensiveStats: formData.defensiveStats,
            }}
            onChange={stats => setFormData(prev => ({ ...prev, ...stats }))}
            />
            <View>
                <View style={styles.inputContainer}>
                    <Text style={styles.proConLabel}>Pros</Text>
                    <TextInput
                        style={styles.proConInput}
                        placeholder="Enter pros..."
                        value={formData.pros}
                    onChangeText={pros => setFormData(prev => ({ ...prev, pros }))}
                    multiline
                    textAlignVertical="top"
                    numberOfLines={4}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.proConLabel}>Cons</Text>
                    <TextInput
                    style={styles.proConInput}
                    placeholder="Enter cons..."
                    value={formData.cons}
                    onChangeText={cons => setFormData(prev => ({ ...prev, cons }))}
                    multiline
                    textAlignVertical="top"
                    numberOfLines={4}
                    />
                </View>

                {formData.media && formData.media.length > 0 && (
                    <MediaGallery 
                        media={formData.media}
                        onDeleteMedia={(mediaId) => {
                            setFormData(prev => ({
                                ...prev,
                                media: prev.media?.filter(m => m.id !== mediaId) || []
                            }));
                        }}
                    />
                )}

                {/* Add MediaInput with proper props */}
                <MediaInput 
                    onMediaSelect={handleMediaSelect}
                    isLoading={false}
                />

                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmit}
                    >
                    <Text style={styles.submitButtonText}>
                        {playerId ? 'Update Player' : 'Add Player'}
                    </Text>
                </TouchableOpacity>
                </View>  
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    proConLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    proConInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: 'black',
        backgroundColor: '#fff',
        height: 100,
    },
    inputContainer: {
        marginBottom: 16,
    },
    keyboard: {
        padding: 16,
        width: '100%',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 200,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    formContainer: {
        padding: 20,
    },
    pickerItem: {
        color: 'white',
        ...Platform.select({
            ios: {
                fontSize: 10,
                height: 50,
                fontWeight: 'bold'
            },
            android: {
                fontSize: 10,
                fontWeight: 'bold'
            }
        }),
    },
    picker: {
        ...Platform.select({
            ios: {
                height: 50,
                backgroundColor: 'transparent',
            },
            android: {
                height: 50,
                backgroundColor: 'transparent',
                color: '#2563eb',
            }
        }),
        width: '100%',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: 'grey',
        overflow: 'hidden', // This helps with the border radius
    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'grey',
        marginBottom: 16,
        fontSize: 14,
    },
    pickerContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    imageButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    imageButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    halfWidth: {
        width: '48%', // Leave some space between the elements
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
