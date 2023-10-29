import React, { Fragment, useState, useEffect } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Input/Input";
import FilePicker from "../../Input/FilePicker";
import Image from "../../Image/Image";
import { required, lengthValue } from "../../../store/validators";
import { generateBase64FromImage } from "../../../store/image";

const FeedEdit = (props) => {
  const [title, setTitle] = useState("");
  const [touchedTitle, setTouchTitle] = useState(false);
  const [validtitle, setValidTitle] = useState(false);

  const [image, setImage] = useState("");
  const [touchedImage, setTouchImage] = useState(false);
  const [validImage, setValidImage] = useState(false);

  const [content, setContent] = useState("");
  const [touchedContent, setTouchContent] = useState(false);
  const [validContent, setValidContent] = useState(false);

  const [formIsValid, setFormValid] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const handleChangeTitle = (id, value, file) => {
    setTitle(value);
    setValidTitle(required(title) && lengthValue({ min: 5 }, title));

    setFormValid(validtitle && validImage && validContent);
  };

  const handleChangeImage = (id, value, file) => {
    generateBase64FromImage(file[0]).then((b64) => {
      setImage(b64);
      setValidImage(required(String(b64)));
      setImagePreview(b64);
      setFormValid(validtitle && validImage && validContent);
    });
  };

  const handleChangeContent = (id, value) => {
    setContent(value);
    setValidContent(required(content) && lengthValue({ min: 5 }, content));
    setFormValid(validtitle && validImage && validContent);
  };

  // accept change
  const acceptPostChangeHandler = () => {
    const post = {
      title: title,
      image: image,
      content: content,
    };
    props.onFinishEdit(post);
    setFormValid(false);
    setTitle("");
    setImage("");
    setContent("");
    setImagePreview(null);
  };

  // cancel change
  const cancelPostChangeHandler = () => {
    setFormValid(false);
    setTitle("");
    setImage("");
    setContent("");
    setImagePreview(null);
    props.onCancelEdit();
  };

  // load edit post
  useEffect(() => {
    if (props.selectedPost) {
      setTitle(props.selectedPost.title);
      setValidTitle(true);
      setImage(props.selectedPost.imageUrl);
      setValidImage(true);
      setContent(props.selectedPost.content);
      setValidContent(true);

      setImagePreview(props.selectedPost.imageUrl);
      setFormValid(true);
    }
  }, [props.selectedPost]);

  return props.editing ? (
    <Fragment>
      <Backdrop onClick={cancelPostChangeHandler} />
      <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={props.loading}
      >
        <form>
          <Input
            id="title"
            label="Title"
            control="input"
            onChange={handleChangeTitle}
            onBlur={() => {
              setTouchTitle(true);
            }}
            valid={validtitle}
            touched={touchedTitle}
            value={title}
          />
          <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={handleChangeImage}
            onBlur={() => {
              setTouchImage(true);
            }}
            valid={validImage}
            touched={touchedImage}
          />
          <div className="new-post__preview-image">
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={handleChangeContent}
            onBlur={() => {
              setTouchContent(true);
            }}
            valid={validContent}
            touched={touchedContent}
            value={content}
          />
        </form>
      </Modal>
    </Fragment>
  ) : null;
};

export default FeedEdit;
