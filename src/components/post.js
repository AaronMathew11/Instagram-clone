import React, { useState, useEffect } from "react";
import "../componentCss/post.css";
import Avatar from "@mui/material/Avatar";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import app from "../firebase1.js";

function Post({ username, caption, imageurl, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const db = getFirestore(app);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = onSnapshot(
        query(collection(db, "comments")),
        (snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        }
      );
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {};

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt='Remy Sharp'
          src='/static/images/avatar/1.jpg'
        />
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageurl} alt='' />
      <h4 className='post__text'>
        <strong>{username}</strong>: {caption}
      </h4>

      {comments.map((comment) => {
        <p>
          <strong>{comment.username}</strong>
          {comment.text}
        </p>;
      })}

      <form className='post__commentBox'>
        <input
          className='post__input'
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className='post__button'
          disabled={!comment}
          type='submit'
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
