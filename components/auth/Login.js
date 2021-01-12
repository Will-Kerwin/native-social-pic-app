import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";

import firebase from "firebase";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const loginUser = () => {
    const { email, password } = values;
    firebase
      .auth()
      .signInWithEmailAndPassword(email,password)
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
        placeholder="email"
        onChangeText={(email) => setValues({ ...values, email })}
      />
      <TextInput
        placeholder="password"
        secureTextEntry
        onChangeText={(password) => setValues({ ...values, password })}
      />

      <Button onPress={loginUser} title="Log In" />
    </View>
  );
}
