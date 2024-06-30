import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();

  const deleteUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.removeItem("chat-user");
      setAuthUser(null);

      toast.success(`User ${data.fullName} deleted successfully`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteUser };
};

export default useDeleteUser;
