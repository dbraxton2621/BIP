import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Header from "../../components/Header";
import PostList from "../../components/PostsList";

export default function Home() {
  return (
    <View style={styles.container}>
      <Header />
      <PostList />
      <Link href="/modal/new-post" asChild>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
