import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {fetchUser} from "../redux/slice/user";

export default function Main() {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.user);

  useEffect( () => {
    if (!currentUser) {
       dispatch(fetchUser());
    }
  },[currentUser]);

  if(currentUser == undefined){
    return(
      <View></View>
    )
  }

  return (
    <View>
      <Text>{currentUser.name} LOGGED IN </Text>
    </View>
  );
}
