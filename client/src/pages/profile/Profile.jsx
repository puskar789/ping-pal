/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../context//AuthContext.jsx";
import useDeleteUser from "../../hooks/useDeleteUser.js";
import { GoHome } from "react-icons/go";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase/firebase.js";
import toast from "react-hot-toast";
import useUpdateProfilePic from "../../hooks/useUpdateProfilePic.js";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  // const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const filePickerRef = useRef();

  const { authUser } = useAuthContext();
  const { loading, updateProfilePic } = useUpdateProfilePic();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // tp get the URL only when a new image is uploaded
  useEffect(() => {
    if (imageFile) {
      getURL();
    }
  }, [imageFile]);

  // to call update only when we get a new URL
  useEffect(() => {
    const update = async () => {
      await updateProfilePic(imageFileURL);
    };

    if (imageFileURL) {
      update();
    }
  }, [imageFileURL]);

  const getURL = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        // setImageFileUploadingError(
        //   "Could not upload image (File size must be less than 2MB)"
        // );
        setImageFileURL(null);
        setImageFile(null);
        toast.error("Could not upload image (File size must be less than 2MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          // console.log(downloadURL);
          // setImageFileUploadingError(null);
        });
      }
    );
  };

  return (
    <div className="flex flex-col sm:h-[450px] md:h-[450px] rounded-lg">
      {openModal ? (
        <AreYouSure openModal={openModal} setOpenModal={setOpenModal} />
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          {/* {imageFileUploadingError && toast.error(imageFileUploadingError)} */}
          <div
            className="flex items-center justify-center w-full h-full"
            onClick={() => filePickerRef.current.click()}
            onMouseEnter={() => {
              toast("Click to change profile picture", {
                icon: "💡",
              });
            }}
          >
            {!loading ? (
              <img
                src={authUser.profilePic}
                alt="user picture"
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <span className="loading loading-spinner"></span>
            )}
          </div>

          <div className="p-4 mb-12">
            <div>
              <label className="label">
                <span className="text-base label-text">Full Name</span>
              </label>
              <input value={authUser.fullName} className="rounded-sm" />
            </div>

            <div>
              <label className="label">
                <span className="text-base label-text">Username</span>
              </label>
              <input value={authUser.username} className="rounded-sm" />
            </div>
          </div>

          <Link to="/" className="absolute top-4 right-4">
            <GoHome className="w-6 h-6" />
          </Link>

          <button
            className="btn bg-red-700"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Delete Account
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;

const AreYouSure = ({ openModal, setOpenModal }) => {
  const { deleteUser } = useDeleteUser();
  const isOpen = openModal ? "modal-open" : "";
  const handleDelete = async () => {
    await deleteUser();
  };

  return (
    <dialog className={`modal ${isOpen}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Are You Sure?</h3>
        <p className="py-4">This will permanently delete your Account</p>
        <div className="modal-action">
          <div className="w-full flex flex-row justify-between">
            <button className="btn bg-red-700" onClick={handleDelete}>
              Yes, I'm sure
            </button>
            <button
              className="btn bg-green-700"
              onClick={() => setOpenModal(false)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
