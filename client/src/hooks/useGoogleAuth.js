import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const googleAuth = async (fullName, username, profilePic, gender) => {
    // console.log(fullName, username, profilePic, gender);
    setLoading(true);
    try {
      const success = handleInputErrors(fullName, username, profilePic, gender);
      if (!success) return;

      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          profilePic,
          gender,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, googleAuth };
};

export default useGoogleAuth;

const handleInputErrors = (fullName, username, profilePic, gender) => {
  if (!fullName || !username || !profilePic || !gender) {
    toast.error("Please provide all information");
    return false;
  }

  return true;
};
