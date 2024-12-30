import { Stack, useLocalSearchParams } from 'expo-router';
import ChatScreen from './ChatScreen';

type ChatParams = {
    id: string;
};

export default function ChatPage() {
    const { id } = useLocalSearchParams<ChatParams>();
    
    return (
        <>
            <Stack.Screen 
                options={{
                    title: 'Chat',
                    headerBackTitle: 'Back',
                }}
            />
            <ChatScreen id={id as string} />
        </>
    );
}
