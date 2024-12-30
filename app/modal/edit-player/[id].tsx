import { Stack, useLocalSearchParams } from 'expo-router';
import PlayerForm from '../../../components/PlayerForm';

export default function EditPlayerModal() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
        <Stack.Screen 
            options={{
            title: 'Edit Player',
            presentation: 'modal',
            }} 
        />
        <PlayerForm playerId={id} />
        </>
    );
}
