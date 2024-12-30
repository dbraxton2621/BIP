import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { PlayerGrades, GradesInputProps } from '../types';

export default function GradesInput({ grades, onChange }: GradesInputProps) {
    const handleGradeChange = (key: keyof PlayerGrades, value: number) => {
        onChange({
        ...grades,
        [key]: value,
        });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Player Grades</Text>
        
        <View style={styles.gradeItem}>
            <Text style={styles.label}>Alignment ({grades.alignment})</Text>
            <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={0.5}
            value={grades.alignment}
            onValueChange={value => handleGradeChange('alignment', value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            />
        </View>

        <View style={styles.gradeItem}>
            <Text style={styles.label}>Assignment ({grades.assignment})</Text>
            <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={0.5}
            value={grades.assignment}
            onValueChange={value => handleGradeChange('assignment', value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            />
        </View>

        <View style={styles.gradeItem}>
            <Text style={styles.label}>Technique ({grades.technique})</Text>
            <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={0.5}
            value={grades.technique}
            onValueChange={value => handleGradeChange('technique', value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            />
        </View>

        <View style={styles.gradeItem}>
            <Text style={styles.label}>Intangibles ({grades.intangibles})</Text>
            <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={0.5}
            value={grades.intangibles}
            onValueChange={value => handleGradeChange('intangibles', value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            />
        </View>

        <View style={styles.totalGrade}>
            <Text style={styles.totalLabel}>Total Grade:</Text>
            <Text style={styles.totalValue}>
            {(grades.alignment + grades.assignment + grades.technique + grades.intangibles).toFixed(1)}
            </Text>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    gradeItem: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    totalGrade: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});
