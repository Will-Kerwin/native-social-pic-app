import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import firebase from "firebase";
import "firebase/firestore";

export default function Profile({ route }) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const { currentUser, posts, following } = useSelector((state) => state.user);

  useEffect(() => {
    if (route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(route.params.uid)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          const posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            // formates a serializable date
            const creation = data.creation.toDate().toISOString();
            return { id, ...data, creation };
          });
          setUserPosts(posts);
        });
    }

    if(following.indexOf(route.params.uid) > -1){
      setIsFollowing(true);
    } else{
      setIsFollowing(false)
    }
  }, [route.params.uid, following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(route.params.uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(route.params.uid)
      .delete();
  }

  if (!user) {
    return <View></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>
      {route.params.uid !== firebase.auth().currentUser.uid ? (
        <View>
          {isFollowing ? (
            <Button title="following" onPress={onUnfollow} />
          ) : (
            <Button title="follow" onPress={onFollow} />
          )}
        </View>
      ) : null}
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image
                source={{ uri: item.downloadURL }}
                style={styles.image}
                accessibilityLabel={item.caption}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
});
