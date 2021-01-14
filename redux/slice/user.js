import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
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
});

export const fetchUserPosts = createAsyncThunk(
  "user/fetchUserPosts",
  async () => {
    const userPosts = await firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
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
        return posts;
      })
      .catch((err) => {
        console.log(err);
      });

    return userPosts;
  }
);

const user = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    posts: [],
  },
  extraReducers: {
    [fetchUser.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
    },
    [fetchUserPosts.fulfilled]: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export default user.reducer;
