import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return {
        hasError: true,
        error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
        hasError: false,
        error: null,
        });
    };

    render() {
        if (this.state.hasError) {
        return (
            <View style={styles.container}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
                {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            </View>
        );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
