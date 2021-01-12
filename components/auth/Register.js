import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";

import firebase from "firebase";

export default function Register() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
  });

  const registerUser = () => {
    const { email, password, name } = values;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="name"
        onChangeText={(name) => setValues({ ...values, name })}
      />
      <TextInput
        placeholder="email"
        onChangeText={(email) => setValues({ ...values, email })}
      />
      <TextInput
        placeholder="password"
        secureTextEntry
        onChangeText={(password) => setValues({ ...values, password })}
      />

      <Button onPress={registerUser} title="Sign Up" />
    </View>
  );
}
