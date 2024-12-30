// Existing types...
export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'DB' | 'K' | 'P';
export type Class = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

export interface PassingStats {
    yards: number;
    touchdowns: number;
    interceptions: number;
    quarterbackRating: number;
}

export interface RushingStats {
    carries: number;
    yards: number;
    touchdowns: number;
    average: number;
}

export interface ReceivingStats {
    receptions: number;
    yards: number;
    touchdowns: number;
    average: number;
}

export interface DefensiveStats {
    soloTackles: number;
    sacks: number;
    forcedFumbles: number;
    interceptions: number;
}

export interface PlayerGrades {
    alignment: number;
    assignment: number;
    technique: number;
    intangibles: number;
}

export interface Media {
    id: string;
    type: 'image' | 'video';
    uri: string;
    timestamp: string;
    notes?: string;
}

export interface ProsConsInput {
    pros: string;
    cons: string;
}

export interface Player {
    id: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    height: string;
    weight: number;
    position: Position;
    school: string;
    class: Class;
    grades: PlayerGrades;
    passingStats?: PassingStats;
    rushingStats?: RushingStats;
    receivingStats?: ReceivingStats;
    defensiveStats?: DefensiveStats;
    pros?: string;
    cons?: string;
    media: Media[];
    lastUpdated: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

export interface Post {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
    likes: number;
    comments: Comment[];
    media?: Media[];  // Added media support
    isLiked: boolean;
    isSaved: boolean;
    isPinned?: boolean;
    allowComments?: boolean;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    lastSeen: string;
}

export interface Thread {
    id: string;
    participants: string[];
    lastMessage: Message;
    unreadCount: number;
    parentMessageId: string;
    messages: Message[];
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
    mediaUrl?: string;
    mediaType?: string;
    fileName?: string;
    type: 'text' | 'image' | 'file' | 'voice';
    reactions?: MessageReaction[];
    duration?: number; // for voice messages
    threadId?: string;
    parentMessageId?: string;
    forwardedFrom?: string;
    encrypted: boolean;
    editHistory?: MessageEdit[];
    scheduledFor?: string;
    linkPreviews?: LinkPreview[];
    status: 'sent' | 'scheduled' | 'failed' | 'sending';
}

export interface TypingStatus {
    userId: string;
    isTyping: boolean;
    timestamp: string;
}

export interface MessageReaction {
    userId: string;
    reaction: string;
    timestamp: string;
}

export interface GroupChat extends Thread {
    name: string;
    avatar: string;
    admins: string[];
    members: string[];
}

export interface BackupMetadata {
    timestamp: string;
    messageCount: number;
    mediaCount: number;
    size: number;
}

export interface MessageEdit {
    content: string;
    timestamp: string;
}

export interface LinkPreview {
    url: string;
    title: string;
    description: string;
    imageUrl?: string;
}

// Component Props Types
export interface PlayerFormProps {
    playerId?: string;
}

export interface StatsInputProps {
    position: Position;
    stats: {
        passingStats?: PassingStats;
        rushingStats?: RushingStats;
        receivingStats?: ReceivingStats;
        defensiveStats?: DefensiveStats;
    };
    onChange: (stats: {
        passingStats?: PassingStats;
        rushingStats?: RushingStats;
        receivingStats?: ReceivingStats;
        defensiveStats?: DefensiveStats;
    }) => void;
}

export interface GradesInputProps {
    grades: PlayerGrades;
    onChange: (grades: PlayerGrades) => void;
}

// Context Types
export interface PlayerContextType {
    players: Player[];
    addPlayer: (player: Omit<Player, 'id' | 'createdAt' | 'lastUpdated'>) => Promise<void>;
    updatePlayer: (id: string, player: Partial<Player>) => Promise<void>;
    deletePlayer: (id: string) => Promise<void>;
    getPlayerById: (id: string) => Player | undefined;
    isLoading: boolean;
}

export interface HighlightsContextType {
    pinnedPosts: Post[];
    addToHighlights: (post: Post) => void;
    removeFromHighlights: (postId: string) => void;
}
