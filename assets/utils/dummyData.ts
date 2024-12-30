import { User, Thread, Message } from "../../types";

export const dummyUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/50',
        lastSeen: '2024-12-15T10:30:00Z',
    },
    {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/50',
        lastSeen: '2024-12-15T11:45:00Z',
    },
    // Add more users as needed
];

export const dummyThreads: Thread[] = [
    {
        id: '1',
        participants: ['1', '2'],
        lastMessage: {
            id: 'm1',
            senderId: '1',
            receiverId: '2',
            content: 'Hey, how are you?',
            timestamp: '2024-12-15T10:30:00Z',
            read: true,
            type: "text",
            encrypted: false,
            status: "sent"
        },
        unreadCount: 0,
        parentMessageId: '',
        messages: []
    },
    // Add more threads as needed
];

export const dummyMessages: Message[] = [
    {
        id: 'm1',
        senderId: '1',
        receiverId: '2',
        content: 'Hey, how are you?',
        timestamp: '2024-12-15T10:30:00Z',
        read: true,
        type: "text",
        encrypted: false,
        status: "sent"
    },
    // Add more messages as needed
];
