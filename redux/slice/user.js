import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";
import { fetchUsersData } from "./users";

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

export const fetchUserFollowing = createAsyncThunk(
  "user/fetchUserFollowing",
  async (_, api) => {
    const following = await firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .get()
      .then((snapshot) => {
        let followers = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        return followers;
      })
      .catch((err) => {
        console.log(err);
      });
      for (let i = 0; i < api.getState().user.following.length; i++) {
        await api.dispatch(fetchUsersData(following[i]));
      }
    return following;
  }
);


const user = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    posts: [],
    following:[]
  },
  extraReducers: {
    [fetchUser.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
    },
    [fetchUserPosts.fulfilled]: (state, action) => {
      state.posts = action.payload;
    },
    [fetchUserFollowing.fulfilled]: (state, action) => {
      state.following = action.payload;
    },
  
  },
});

export default user.reducer;
