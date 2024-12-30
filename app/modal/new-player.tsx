import { Stack } from 'expo-router';
import PlayerForm from '../../components/PlayerForm';

export default function NewPlayerModal() {
    return (
        <>
        <Stack.Screen 
            options={{
            title: 'Add New Player',
            presentation: 'modal',
            }} 
        />
        <PlayerForm />
        </>
    );
}
