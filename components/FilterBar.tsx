import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Position, Class } from '../types';
import Colors from '../constants/Colors';

interface FilterBarProps {
    positionFilter: Position | 'All';
    classFilter: Class | 'All';
    sortOrder: 'asc' | 'desc';
    onPositionChange: (position: Position | 'All') => void;
    onClassChange: (classYear: Class | 'All') => void;
    onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export default function FilterBar({
    positionFilter,
    classFilter,
    sortOrder,
    onPositionChange,
    onClassChange,
    onSortOrderChange,
}: FilterBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={positionFilter}
                        onValueChange={(itemValue) => onPositionChange(itemValue as Position | 'All')}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item key="all-pos" label="Pos" value="All" />
                        <Picker.Item key="qb" label="QB" value="QB" />
                        <Picker.Item key="rb" label="RB" value="RB" />
                        <Picker.Item key="wr" label="WR" value="WR" />
                        <Picker.Item key="te" label="TE" value="TE" />
                        <Picker.Item key="ol" label="OL" value="OL" />
                        <Picker.Item key="dl" label="DL" value="DL" />
                        <Picker.Item key="lb" label="LB" value="LB" />
                        <Picker.Item key="db" label="DB" value="DB" />
                        <Picker.Item key="k" label="K" value="K" />
                        <Picker.Item key="p" label="P" value="P" />
                    </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={classFilter}
                        onValueChange={(itemValue) => onClassChange(itemValue as Class | 'All')}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item key="all-class" label="Classes" value="All" />
                        <Picker.Item key="freshman" label="Freshman" value="Freshman" />
                        <Picker.Item key="sophomore" label="Sophomore" value="Sophomore" />
                        <Picker.Item key="junior" label="Junior" value="Junior" />
                        <Picker.Item key="senior" label="Senior" value="Senior" />
                    </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={sortOrder}
                        onValueChange={(itemValue) => onSortOrderChange(itemValue as 'asc' | 'desc')}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item key="highest" label="Highest" value="desc" />
                        <Picker.Item key="lowest" label="Lowest" value="asc" />
                    </Picker>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        minHeight: 40,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        height: 40,
        justifyContent: 'center',
        marginHorizontal: 4,
        overflow: 'hidden',
    },
    picker: {
        ...Platform.select({
            ios: {
                height: 40,
                backgroundColor: 'transparent',
            },
            android: {
                height: 40,
                backgroundColor: 'transparent',
                color: Colors.light.tint,
            }
        }),
        width: '100%',
        backgroundColor: 'grey'
    },
    pickerItem: {
        ...Platform.select({
            ios: {
                fontSize: 14,
                height: 40,
            },
            android: {
                fontSize: 14,
            }
        }),
        color: 'white',
    },
});
