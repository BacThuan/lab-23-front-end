import React, { Component, Fragment, useState, useEffect } from "react";
import openSocket from "socket.io-client";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import Post from "../../component/Feed/Post/Post";
import Button from "../../component/Button/Button";
import FeedEdit from "../../component/Feed/FeedEdit/FeedEdit";
import Input from "../../component/Input/Input";
import Paginator from "../../component/Paginator/Paginator";
import ErrorHandler from "../../component/ErrorHandler/ErrorHandler";
import { baseUrl } from "../../store/url";
import "./Feed.css";

const Feed = () => {
  const [error, setError] = useState(false);
  const [isEditing, setEdit] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotal] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  const token = useSelector((state) => state.token);

  // update status
  const statusUpdateHandler = (event) => {
    event.preventDefault();
    fetch(baseUrl + "/auth/status", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch(catchError);
  };

  // load page
  const loadPosts = (direction) => {
    if (direction) {
      setPostLoading(true);
      setPosts([]);
    }
    let page = postPage;
    if (direction === "next") {
      page++;
      setPostPage(page);
    }
    if (direction === "previous") {
      page--;
      setPostPage(page);
    }
    fetch(baseUrl + "/feed/posts?page=" + page, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }

        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setPosts(resData.posts);

        setTotal(resData.totalItems);
        setPostLoading(false);
      })
      .catch(catchError);
  };

  // delete post
  const deletePostHandler = (postId) => {
    setPostLoading(true);

    fetch(baseUrl + "/feed/post/" + postId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Methods": "DELETE",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedPosts = posts.filter((p) => p._id !== postId);
        setPosts(updatedPosts);
        setPostLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPostLoading(false);
      });
  };

  // start edit
  const startEditPostHandler = (postId) => {
    const loadedPost = posts.find((p) => p._id === postId);

    setEditPost(loadedPost);
    setEdit(true);
  };

  // enable edit for new post
  const newPostHandler = () => {
    setEdit(true);
  };

  // finish edit
  const finishEditHandler = (postData) => {
    setEditLoading(true);

    const body = JSON.stringify({
      title: postData.title,
      image: postData.image,
      content: postData.content,
    });

    // for add new
    let url = baseUrl + "/feed/post";
    let method = "POST";

    // for edit
    if (editPost) {
      url = baseUrl + "/feed/post/" + editPost._id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      body: body,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        // return res.json();
      })
      .then((resData) => {
        // console.log(resData);

        // const post = {
        //   _id: resData.post._id,
        //   title: resData.post.title,
        //   content: resData.post.content,
        //   creator: resData.post.creator.name,
        //   createdAt: resData.post.createdAt,
        // };
        // let updatedPosts = posts;

        // edit post
        // if (editPost) {
        //   const postIndex = posts.findIndex((p) => p._id === editPost._id);
        //   updatedPosts[postIndex] = post;
        // }
        //   // only 1 post
        //   else if (posts.length < 2) {
        //     updatedPosts = posts.concat(post);
        //   }

        // setPosts(updatedPosts);
        setEdit(false);
        setEditPost(null);
        setEditLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setEdit(false);
        setEditPost(null);
        setEditLoading(false);
        setError(true);
      });
  };

  // cancel edit
  const cancelEditHandler = () => {
    setEdit(false);
    setEditPost(null);
  };

  // change status
  const statusInputChangeHandler = (id, value, file) => {
    setStatus(value);
  };

  // handle error
  const errorHandler = () => {
    setError(false);
  };
  const catchError = (error) => {
    setError(true);
    console.log(error);
  };

  // thao tac dom cho socket
  // tao bai post
  const addPost = (post) => {
    let updatedPosts = posts;
    if (updatedPosts.length <= 1) {
      updatedPosts.push(post);
    }

    setPosts(updatedPosts);
  };

  // update post
  const updatePost = (post) => {
    let updatedPosts = posts;

    const postIndex = posts.findIndex((p) => p._id === post._id);
    if (postIndex > -1) updatedPosts[postIndex] = post;

    setPosts(updatedPosts);
  };

  // is auth ?
  useEffect(() => {
    fetch(baseUrl + "/auth/status", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }

        return res.json();
      })
      .then((resData) => {
        setStatus(resData.status);
      })
      .catch(catchError);

    loadPosts();
    const socket = openSocket(baseUrl, {
      withCredentials: true,
    });

    socket.on("posts", (data) => {
      if (data.action === "create") {
        addPost(data.post);
      } else if (data.action === "update") {
        updatePost(data.post);
      } else if (data.action === "delete") {
        loadPosts();
      }
    });
  }, []);

  return (
    <Fragment>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className="feed">
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          <Paginator
            onPrevious={loadPosts.bind(this, "previous")}
            onNext={loadPosts.bind(this, "next")}
            lastPage={Math.ceil(totalPosts / 2)}
            currentPage={postPage}
          >
            {posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator.name}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={startEditPostHandler.bind(this, post._id)}
                onDelete={deletePostHandler.bind(this, post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </Fragment>
  );
};

export default Feed;
