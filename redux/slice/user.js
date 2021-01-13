import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from 'firebase';

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async () => {
       const user = await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
              return snapshot.data();
          } else {
            console.log("does not exist");
          }
        });

        return user;
    }
)

const user = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  extraReducers:{
      [fetchUser.fulfilled]: (state, action) => {
      state.currentUser = action.payload
    }
  }
});

export default user.reducer;