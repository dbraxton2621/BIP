import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal  } from 'react-native';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import PostsList from './../../components/PostsList';
import RepliesList from './../../components/RepliesList';
import HighlightsList from './../../components/HighlightsList';
import MediaList from './../../components/MediaList';
import EditProfile from '../../components/EditProfile';

interface AnalystProfile {
    id: string;
    name: string;
    tag: string;
    profileImage: string;
    headerImage: string;
    bio: string;
    location: string;
    website: string;
    followersCount: number;
    followingCount: number;
    isVerified: boolean;
}

type Tab = 'posts' | 'replies' | 'highlights' | 'media';

export default function AnalystProfile() {
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profile, setProfile] = useState<AnalystProfile>({
        id: '1',
        name: 'John Analyst',
        tag: '@JohnAnalyst',
        profileImage: 'https://placeholder.com/profile',
        headerImage: 'https://placeholder.com/header',
        bio: 'Professional sports analyst specializing in player performance metrics',
        location: 'Denver, CO',
        website: 'analyst.com/john',
        followersCount: 5234,
        followingCount: 1234,
        isVerified: true,
    });

    const handleEditProfile = () => {
        setShowEditProfile(true);
    };

    const handleSaveProfile = (updatedProfile: Omit<AnalystProfile, 'id' | 'followersCount' | 'followingCount' | 'isVerified'>) => {
        setProfile({
            ...profile,
            ...updatedProfile
        });
        setShowEditProfile(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return <PostsList 
                    isProfileView={true} 
                    userId={profile.id} 
                    ListHeaderComponent={renderHeader}
                />;
            case 'replies':
                return <RepliesList ListHeaderComponent={renderHeader} />;
            case 'highlights':
                return <HighlightsList ListHeaderComponent={renderHeader} />;
            case 'media':
                return <MediaList ListHeaderComponent={renderHeader} />;
            default:
                return null;
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Image
                source={{ uri: profile.headerImage }}
                style={styles.headerImage}
            />
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: profile.profileImage }}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <View style={styles.profileActions}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{profile.name}</Text>
                            {profile.isVerified && (
                                <View style={styles.analystBadge}>
                                    <MaterialIcons name="verified" size={20} color="#1DA1F2" />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleEditProfile}
                        >
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.tag}>{profile.tag}</Text>
                    <Text style={styles.bio}>{profile.bio}</Text>

                    <View style={styles.locationWebsite}>
                        <View style={styles.infoItem}>
                            <Feather name="map-pin" size={16} color="#657786" />
                            <Text style={styles.infoText}>{profile.location}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Feather name="link" size={16} color="#657786" />
                            <Text style={styles.infoText}>{profile.website}</Text>
                        </View>
                    </View>

                    <View style={styles.followInfo}>
                        <Text style={styles.followText}>
                            <Text style={styles.followCount}>{profile.followingCount}</Text> Following
                        </Text>
                        <Text style={styles.followText}>
                            <Text style={styles.followCount}>{profile.followersCount}</Text> Followers
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.tabsContainer}>
                <View style={styles.tabs}>
                    {(['posts', 'replies', 'highlights', 'media'] as Tab[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {renderTabContent()}
            </View>

            <Link href="/modal/new-post" asChild>
                <TouchableOpacity style={styles.addButton}>
                    <FontAwesome name="plus" size={24} color="#fff" />
                </TouchableOpacity>
            </Link>

            <Modal
                animationType="slide"
                visible={showEditProfile}
                onRequestClose={() => setShowEditProfile(false)}
            >
                <EditProfile
                    initialData={{
                        name: profile.name,
                        tag: profile.tag,
                        bio: profile.bio,
                        location: profile.location,
                        website: profile.website,
                        profileImage: profile.profileImage,
                        headerImage: profile.headerImage,
                    }}
                    onSave={handleSaveProfile}
                    onCancel={() => setShowEditProfile(false)}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    headerContainer: {
        backgroundColor: '#fff',
    },
    nameContainer: {
        flexDirection: 'row',
    },
    headerImage: {
        width: '100%',
        height: 150,
    },
    profileSection: {
        padding: 15,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        marginTop: -40,
    },
    profileActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    editButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    editButtonText: {
        color: '#000',
        fontWeight: '600',
    },
    analystBadge: {
        marginLeft: 10,
    },
    profileInfo: {
        marginTop: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tag: {
        fontSize: 15,
        color: '#657786',
        marginTop: 2,
    },
    bio: {
        marginTop: 10,
        fontSize: 15,
        lineHeight: 20,
    },
    locationWebsite: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    infoText: {
        color: '#657786',
        fontSize: 14,
    },
    followInfo: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 20,
    },
    followText: {
        color: '#657786',
        fontSize: 14,
    },
    followCount: {
        color: '#000',
        fontWeight: '600',
    },
    tabsContainer: {
        backgroundColor: '#fff',
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#1DA1F2',
    },
    tabText: {
        color: '#657786',
    },
    activeTabText: {
        color: '#1DA1F2',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: 'gray',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
