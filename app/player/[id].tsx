import { Stack, useLocalSearchParams } from 'expo-router';
import PlayerDetails from '../../components/PlayerDetails';

export default function PlayerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
        <Stack.Screen 
            options={{
            title: 'Player Details',
            presentation: 'card',
            }} 
        />
        <PlayerDetails playerId={id} />
        </>
    );
}
