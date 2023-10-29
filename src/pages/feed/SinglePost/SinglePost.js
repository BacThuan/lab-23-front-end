import React, { useState, useEffect } from "react";
import Image from "../../../component/Image/Image";
import "./SinglePost.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../store/url";

const SinglePost = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const params = useParams();
  const token = useSelector((state) => state.token);

  useEffect(() => {
    fetch(baseUrl + "/feed/post/" + params.idPost, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        const post = res.post;

        setTitle(post.title);
        setAuthor(post.creator.name);
        setDate(new Date(post.createdAt).toLocaleDateString("en-US"));
        setImage(post.imageUrl);
        setContent(post.content);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <section className="single-post">
      <h1>{title}</h1>
      <h2>
        Created by {author} on {date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={image} />
      </div>
      <p>{content}</p>
    </section>
  );
};

export default SinglePost;
