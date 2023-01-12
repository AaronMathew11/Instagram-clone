import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./components/post";
import app from "./firebase1.js";
import { getFirestore, getDocs, orderBy, Timestamp } from "firebase/firestore";
import {
  getAuth,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import ImageUpload from "./components/ImageUpload";
// import InstagramEmbed from 'react-instagram-embed';
import { InstagramEmbed } from "react-social-media-embed";

const db = getFirestore(app);
const auth = getAuth(app);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in.....
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out......

        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      }
    );
  }, []);

  const signup = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(auth.currentUser, {
          displayName: username,
        });
      })
      .catch((error) => alert(error.code));
    setOpen(false);
  };

  const signin = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error.code)
    );

    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
              />
            </center>
            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signup}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
              />
            </center>
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signin}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>

      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''
        />
        {user ? (
          <Button type='submit' onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <div className='app__logincontainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>

            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
        <div className='app_postsleft'>
          {posts.map(({ id, post }) => (
            <Post
              username={post.username}
              caption={post.caption}
              imageurl={post.imageurl}
              key={id}
              postId={id}
            />
          ))}
        </div>
        <div className='app__postsright'>
          <InstagramEmbed
            url='https://www.instagram.com/p/CUbHfhpswxt/'
            width={328}
            captioned
          />
        </div>
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
</div> */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you will need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
