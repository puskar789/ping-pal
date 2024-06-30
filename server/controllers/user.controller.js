import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // don't want the user themseleves

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();
    if (req.params.id !== loggedInUserId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this user" });
    }

    const id = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        profilePic: req.body.profilePic,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfilePic controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user._id;

    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error in deleteUser controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
