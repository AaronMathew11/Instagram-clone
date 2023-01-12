import { Button } from "@mui/material";
import React, { useState } from "react";
import '../componentCss/imageupload.css'
import app from "../firebase1.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";

function ImageUpload({ username }) {
  const storage = getStorage(app);

  const db = getFirestore(app);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handlechange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleupload = () => {
    const storageRef = ref(storage, `${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function ...
        console.log(error);
        alert(error.code);
      },
      () => {
        //complete function ...

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("file available at", downloadURL);

          addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageurl: downloadURL,
            username: username,
          });
        });

        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max='100' />
      <input
        type='text'
        placeholder='Caption here'
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      ></input>
      <input type='file' onChange={handlechange}></input>
      <Button onClick={handleupload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
