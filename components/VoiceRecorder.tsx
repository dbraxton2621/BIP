import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VoiceRecorderProps {
    onRecordingComplete: (uri: string, duration: number) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const animationValue = useRef(new Animated.Value(1)).current;
    const recordingTimer = useRef<NodeJS.Timeout>();

    const startRecording = async () => {
        try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
        setDuration(0);

        // Start duration timer
        recordingTimer.current = setInterval(() => {
            setDuration(d => d + 1);
        }, 1000);

        // Start pulse animation
        Animated.loop(
            Animated.sequence([
            Animated.timing(animationValue, {
                toValue: 1.2,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            ])
        ).start();
        } catch (err) {
        console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
        await recording.stopAndUnloadAsync();
        clearInterval(recordingTimer.current);
        animationValue.setValue(1);

        const uri = recording.getURI();
        if (uri) {
            onRecordingComplete(uri, duration);
        }

        setRecording(null);
        setIsRecording(false);
        setDuration(0);
        } catch (err) {
        console.error('Failed to stop recording', err);
        }
    };

    return (
        <View style={styles.container}>
        <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={styles.recordButton}
        >
            <Animated.View
            style={[
                styles.recordButtonInner,
                { transform: [{ scale: animationValue }] },
            ]}
            >
            <Ionicons
                name={isRecording ? 'mic' : 'mic-outline'}
                size={24}
                color={isRecording ? '#FF3B30' : '#007AFF'}
            />
            </Animated.View>
        </TouchableOpacity>
        {isRecording && (
            <Text style={styles.duration}>
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </Text>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    // ... existing styles ...
    container: {
    flex: 1,
    backgroundColor: '#fff',
    },
    recordButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    },
    recordButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    },
    duration: {
    fontSize: 12,
    color: '#FF3B30',
    marginLeft: 8,
    },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    },
    reactionsList: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    },
    reactionItem: {
    padding: 8,
    },
    reactionEmoji: {
    fontSize: 24,
    },
    existingReactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    },
    searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 8,
    margin: 8,
    },
    searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    },
    resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    },
    resultText: {
    fontSize: 16,
    },
    resultDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    },
    groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    },
    groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    },
    groupName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    },
});