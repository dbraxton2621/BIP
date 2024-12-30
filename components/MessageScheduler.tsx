import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addHours, addDays, setHours, setMinutes, isBefore } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface MessageSchedulerProps {
    onSchedule: (date: Date) => void;
    onCancel: () => void;
    loading?: boolean;
}

interface QuickOption {
    label: string;
    getDate: () => Date;
}

export const MessageScheduler: React.FC<MessageSchedulerProps> = ({
    onSchedule,
    onCancel,
    loading = false
}) => {
    const [date, setDate] = useState(new Date());
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quickOptions: QuickOption[] = useMemo(() => [
        {
            label: 'In 1 hour',
            getDate: () => addHours(new Date(), 1)
        },
        {
            label: 'This evening',
            getDate: () => {
                const today = new Date();
                return setHours(setMinutes(today, 0), 20);
            }
        },
        {
            label: 'Tomorrow morning',
            getDate: () => {
                const tomorrow = addDays(new Date(), 1);
                return setHours(setMinutes(tomorrow, 0), 9);
            }
        },
        {
            label: 'Tomorrow evening',
            getDate: () => {
                const tomorrow = addDays(new Date(), 1);
                return setHours(setMinutes(tomorrow, 0), 20);
            }
        }
    ], []);

    const handleDateChange = (selectedDate: Date) => {
        if (isBefore(selectedDate, new Date())) {
            setError('Cannot schedule message in the past');
            return;
        }
        setError(null);
        setDate(selectedDate);
    };

    const handleSchedule = () => {
        if (isBefore(date, new Date())) {
            setError('Cannot schedule message in the past');
            return;
        }
        onSchedule(date);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Schedule Message</Text>
                <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Quick Schedule</Text>
            <View style={styles.quickOptions}>
                {quickOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.quickOption}
                        onPress={() => handleDateChange(option.getDate())}
                        disabled={loading}
                    >
                        <Text style={styles.quickOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity 
                style={styles.customButton}
                onPress={() => setShowCustomPicker(true)}
                disabled={loading}
            >
                <Ionicons name="calendar" size={20} color="#007AFF" />
                <Text style={styles.customButtonText}>Custom Time</Text>
            </TouchableOpacity>

            {showCustomPicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        setShowCustomPicker(false);
                        if (selectedDate) {
                            handleDateChange(selectedDate);
                        }
                    }}
                    minimumDate={new Date()}
                />
            )}

            <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Message will be sent:</Text>
                <Text style={styles.previewTime}>
                    {format(date, 'EEEE, MMMM d, yyyy')}
                </Text>
                <Text style={styles.previewTime}>
                    {format(date, 'h:mm a')}
                </Text>
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.scheduleButton, error && styles.scheduleButtonDisabled]}
                    onPress={handleSchedule}
                    disabled={loading || !!error}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.scheduleButtonText}>Schedule</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    quickOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    quickOption: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 8,
        margin: 4,
        minWidth: '45%',
    },
    quickOptionText: {
        color: '#007AFF',
        fontSize: 14,
        textAlign: 'center',
    },
    customButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        marginBottom: 16,
    },
    customButtonText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 8,
    },
    previewContainer: {
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    previewLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    previewTime: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    cancelButton: {
        marginRight: 12,
        padding: 8,
    },
    scheduleButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        paddingHorizontal: 24,
    },
    scheduleButtonDisabled: {
        backgroundColor: '#B4B4B4',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
    scheduleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
