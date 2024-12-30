import React, { createContext, useContext, useState, useCallback } from 'react';
import { Post } from '../types';

interface HighlightsContextType {
    pinnedPosts: Post[];
    addToHighlights: (post: Post) => void;
    removeFromHighlights: (postId: string) => void;
}

const HighlightsContext = createContext<HighlightsContextType | undefined>(undefined);

export function HighlightsProvider({ children }: { children: React.ReactNode }) {
    const [pinnedPosts, setPinnedPosts] = useState<Post[]>([]);

    const addToHighlights = useCallback((post: Post) => {
        setPinnedPosts(currentPosts => {
            // Check if post is already pinned
            if (currentPosts.some(p => p.id === post.id)) {
                return currentPosts;
            }
            // Add new post with isPinned set to true
            return [...currentPosts, { ...post, isPinned: true }];
        });
    }, []);

    const removeFromHighlights = useCallback((postId: string) => {
        setPinnedPosts(currentPosts => 
            currentPosts.filter(post => post.id !== postId)
        );
    }, []);

    return (
        <HighlightsContext.Provider 
            value={{ 
                pinnedPosts, 
                addToHighlights, 
                removeFromHighlights 
            }}
        >
            {children}
        </HighlightsContext.Provider>
    );
}

export function useHighlights() {
    const context = useContext(HighlightsContext);
    if (context === undefined) {
        throw new Error('useHighlights must be used within a HighlightsProvider');
    }
    return context;
}
