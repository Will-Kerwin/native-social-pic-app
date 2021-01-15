import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import firebase from "firebase";
import "firebase/firestore";

export default function Search({ navigation }) {
  const [users, setUsers] = useState([]);

  //different from redux this return similiar users
  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      //finds equal to letter or more letters
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        const users = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        
        setUsers(users);
      });
  };
  return (
    <View>
      <TextInput onChangeText={(search) => fetchUsers(search)} placeholder="Search Here . . ." />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
                navigation.navigate("Profile", { uid: item.id })
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
