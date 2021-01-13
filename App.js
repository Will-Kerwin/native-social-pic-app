import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";

import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Main from "./components/Main";

import { configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux"
import rootReducer from "./redux/index";

// using toolkit we make it easier by toolkit configuring dev tools, thunk etc
const store = configureStore({
  reducer: rootReducer,
});

//firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyC-0AQ_O89nm-EKygAt4ai1MwvXFqW-1x0",
  authDomain: "native-social-pic-app.firebaseapp.com",
  projectId: "native-social-pic-app",
  storageBucket: "native-social-pic-app.appspot.com",
  messagingSenderId: "789105035726",
  appId: "1:789105035726:web:14fcb2f729e3b5a699839f",
  measurementId: "G-90CGP0NVZS"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// this will be our screens and routes
const Stack = createStackNavigator();

// main app
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    });
  });

  if (!loaded) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // If logged in return main screen with provider
  if (loggedIn) {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
