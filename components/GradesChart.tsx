import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PlayerGrades } from '../types';
import { LineChart } from 'react-native-chart-kit';

interface GradesChartProps {
    grades: PlayerGrades;
}

export default function GradesChart({ grades }: GradesChartProps) {
    const data = {
        labels: ['ALI', 'ASG', 'TEC', 'INT'],
        datasets: [{
        data: [
            grades.alignment,
            grades.assignment,
            grades.technique,
            grades.intangibles,
        ],
        }],
    };

    const chartConfig = {
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        style: {
        borderRadius: 16,
        },
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Performance Grades</Text>
        <LineChart
            data={data}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
        />
        <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
            <Text style={styles.legendLabel}>ALI: Alignment</Text>
            <Text style={styles.legendValue}>{grades.alignment}</Text>
            </View>
            <View style={styles.legendItem}>
            <Text style={styles.legendLabel}>ASG: Assignment</Text>
            <Text style={styles.legendValue}>{grades.assignment}</Text>
            </View>
            <View style={styles.legendItem}>
            <Text style={styles.legendLabel}>TEC: Technique</Text>
            <Text style={styles.legendValue}>{grades.technique}</Text>
            </View>
            <View style={styles.legendItem}>
            <Text style={styles.legendLabel}>INT: Intangibles</Text>
            <Text style={styles.legendValue}>{grades.intangibles}</Text>
            </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    legendContainer: {
        flexDirection: 'row',
        // flexWrap: 'wrap',
        marginTop: 6,
        justifyContent: 'space-between',
    },
    legendItem: {
        width: '18%',
        marginBottom: 2,
    },
    legendLabel: {
        fontSize: 13,
        color: '#666',
    },
    legendValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
});
