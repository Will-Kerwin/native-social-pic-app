import React, {useState} from 'react';
import { View, TextInput, Image, Button } from 'react-native';
import {useDispatch} from "react-redux"
import {fetchUserPosts} from "../../redux/slice/user"

import firebase from "firebase"
import "firebase/firestore";
import "firebase/firebase-storage";

export default function Save({navigation, route}) {
    const dispatch = useDispatch()
    const [caption, setCaption] = useState("");

    const uploadImage = async () => {
        const uri = route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath);

        const res = await fetch(uri);
        const blob = await res.blob();

        const task = firebase
        .storage()
        .ref()
        .child(childPath)
        .put(blob);

        const taskProgress = snapshot => {
            const percentageProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`transfrered: ${Math.floor(percentageProgress)} %`);
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot)=>{
                savePostData(snapshot);
            })
        }

        const taskError = error => {
            console.error(error);
        }

        task.on(firebase.storage.TaskEvent.STATE_CHANGED,taskProgress, taskError, taskCompleted);
    };

    const savePostData = (downloadURL) => {
        firebase.firestore()
        .collection("posts")
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
            downloadURL,
            caption,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(()=>{
            dispatch(fetchUserPosts())
            navigation.popToTop();
        })
    };

    return (
        <View style={{flex:1}}>
            <Image source={{uri:route.params.image}}/>
            <TextInput
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button
                title="Save"
                onPress={uploadImage}
            />
        </View>
    )
}
