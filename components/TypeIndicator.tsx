import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface TypeIndicatorProps {
    isVisible: boolean;
}

export const TypeIndicator: React.FC<TypeIndicatorProps> = ({ isVisible }) => {
    const [dots] = React.useState<Animated.Value[]>([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]);

    React.useEffect(() => {
        const animations = dots.map((dot, index) =>
        Animated.sequence([
            Animated.delay(index * 200),
            Animated.loop(
            Animated.sequence([
                Animated.spring(dot, {
                toValue: 1,
                useNativeDriver: true,
                }),
                Animated.spring(dot, {
                toValue: 0,
                useNativeDriver: true,
                }),
            ])
            ),
        ])
        );

        if (isVisible) {
        Animated.parallel(animations).start();
        } else {
        animations.forEach(animation => animation.stop());
        }

        return () => {
        animations.forEach(animation => animation.stop());
        };
    }, [isVisible, dots]);

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
        <Text style={styles.text}>typing</Text>
        {dots.map((dot, index) => (
            <Animated.View
            key={index}
            style={[
                styles.dot,
                {
                transform: [
                    {
                    translateY: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -6],
                    }),
                    },
                ],
                },
            ]}
            />
        ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    text: {
        fontSize: 12,
        marginRight: 4,
        color: '#666',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#666',
        marginHorizontal: 2,
    },
});
