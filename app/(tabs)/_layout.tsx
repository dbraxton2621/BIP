import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home-filled" size={24} color={color} />,
          headerShown: true
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Messaging"
        options={{
          title: 'Messenger',
          tabBarIcon: ({ color }) => <MaterialIcons name="mail" size={24} color={color} />,
          headerShown: true
        }}
      />
      <Tabs.Screen
        name="PlayerRankings"
        options={{
          title: 'Athletes',
          tabBarIcon: ({ color }) => <MaterialIcons name="sports-football" size={24} color={color} />,
          headerShown: true
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
