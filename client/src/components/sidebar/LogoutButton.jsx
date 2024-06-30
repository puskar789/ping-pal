import React from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import useLogout from "../../hooks/useLogout";
import { Link } from "react-router-dom";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="mt-auto flex justify-between">
      {!loading ? (
        <BiLogOut
          className="w-6 h-6 text-white cursor-pointer"
          onClick={logout}
        />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
      <Link to="/profile">
        <CgProfile className="w-6 h-6 text-white cursor-pointer" />
      </Link>
    </div>
  );
};

export default LogoutButton;
