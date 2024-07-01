import React, { useEffect, useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa6";
import { app } from "../../firebase/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import useSendMessage from "../../hooks/useSendMessage";

const UpImage = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const inputRef = useRef();
  const { loading, sendMessage } = useSendMessage();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    if (image) {
      //   toast("Sending Image...", {
      //     icon: "📤",
      //   });
      toast("Sending Image...", {
        duration: 10000,
      });
      getURL();
    }
  }, [image]);

  useEffect(() => {
    const send = async () => {
      await sendMessage(imageURL);
      setImage(null);
      setImageURL(null);
    };

    if (imageURL) {
      send();
    }
  }, [imageURL]);

  const getURL = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        toast.error("Image size must be less than 2MB");
        setImage(null);
        setImageURL(null);
      },
      () => {
        getDownloadURL(storageRef).then((url) => {
          setImageURL(url);
        });
      }
    );
  };

  console.log(imageURL);
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        ref={inputRef}
        hidden
      />
      <button
        type="button"
        className="pl-3 inset-y-0 end-0 flex items-center"
        onClick={() => inputRef.current.click()}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <FaRegImage />
        )}
      </button>
    </>
  );
};

export default UpImage;
