import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";

export const fetchUsersData = createAsyncThunk(
  "users/fetchUsers",
  async (uid, api) => {
    const found = await api.getState().users.users.some((el) => el.uid === uid);
    if (!found) {
      const user = await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            return user;
          } else {
            console.log("does not exist");
          }
        });
      await api.dispatch(fetchUsersFollowingPosts(user.id));
      return user;
    }
    if(found){
        return;
    }
  }
);

export const fetchUsersFollowingPosts = createAsyncThunk(
  "users/fetchUsersPosts",
  async (uid, api) => {
    const userPosts = await firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
          if(!snapshot.exists()){
              console.log("here");
          }
        // some trick he showed to find uid in async
        const uid = snapshot.query.EP.path.segments[1];
        console.log({ snapshot, uid });

        let posts = snapshot.docs.map((doc) => {
          const user = api.getState().users.find((el) => el.uid === uid);
          const data = doc.data();
          const id = doc.id;
          // formates a serializable date
          const creation = data.creation.toDate().toISOString();
          return { id, ...data, creation, user };
        });
        return posts;
      })
      .catch((err) => {
        console.log(err);
      });

    return userPosts;
  }
);

const users = createSlice({
  name: "users",
  initialState: {
    users: [],
    userLoaded: 0,
  },
  extraReducers: {
    [fetchUsersData.fulfilled]: (state, action) => {
      state.users.push(action.payload);
    },
    [fetchUsersFollowingPosts.fulfilled]: (state, action) => {
      state.userLoaded++;
      state.users = state.users.map((user) =>
        user.uid === action.uid ? { ...user, posts: action.posts } : user
      );
    },
  },
});

export default users.reducer;
