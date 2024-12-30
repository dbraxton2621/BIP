import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';

interface MessageEditorProps {
    message: Message;
    onSave: (editedMessage: string) => void;
    onCancel: () => void;
}

export const MessageEditor: React.FC<MessageEditorProps> = ({
    message,
    onSave,
    onCancel,
    }) => {
    const [editedContent, setEditedContent] = useState(message.content);

    return (
        <View style={styles.container}>
        <TextInput
            style={styles.input}
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
            autoFocus
        />
        <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            >
            <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(editedContent)}
            >
            <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // ... existing styles ...
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
    input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    },
    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    },
    cancelButton: {
    marginRight: 12,
    padding: 8,
    },
    saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
    },
    cancelButtonText: {
    color: '#666',
    fontSize: 16,
    },
    saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    },
    image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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