import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { io } from "../socket/socket.js";

const hairColor = [
  "0e0e0e",
  "3eac2c",
  "6a4e35",
  "85c2c6",
  "796a45",
  "562306",
  "592454",
  "ab2a18",
  "ac6511",
  "afafaf",
  "b9a05f",
  "cb6820",
  "dba3be",
  "e5d7a3",
];

const skinColor = ["9e5622", "763900", "ecad80", "f2d3b1"];

const getRandomNumber = () => {
  const number = Math.floor(Math.random() * 19) + 1;
  return number.toString().padStart(2, "0");
};

const getRandomColor = () => {
  return hairColor[Math.floor(Math.random() * hairColor.length)];
};

const getRandomSkin = () => {
  return skinColor[Math.floor(Math.random() * skinColor.length)];
};

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password != confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const boyProfilePic = `https://api.dicebear.com/9.x/adventurer/svg?hair=short${getRandomNumber()}&hairColor=${getRandomColor()}&skinColor=${getRandomSkin()}&backgroundColor=d1d4f9`;

    const girlProfilePic = `https://api.dicebear.com/9.x/adventurer/svg?hair=long${getRandomNumber()}&hairColor=${getRandomColor()}&skinColor=${getRandomSkin()}&backgroundColor=d1d4f9`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      io.emit("newUserSign", newUser);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const google = async (req, res) => {
  try {
    const { fullName, username, profilePic, gender } = req.body;

    if (!fullName || !username || !profilePic || !gender) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const user = await User.findOne({ username });

    // user is trying to login without creating an account
    if (!user && gender === "default") {
      return res.status(404).json({ error: "User not found" });
    }

    if (user) {
      const { password, ...currUser } = user._doc;
      generateTokenAndSetCookie(currUser._id, res);
      return res.status(200).json(currUser);
    } else {
      const nameBeforeAt = fullName.split("@")[0];

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      const newUser = new User({
        fullName: nameBeforeAt,
        username,
        password: hashedPassword,
        gender,
        profilePic,
      });

      await newUser.save();
      const { password, ...currUser } = newUser._doc;

      generateTokenAndSetCookie(currUser._id, res);
      res.status(200).json(currUser);
    }
  } catch (error) {
    console.log("Error in google controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordRight = await bcryptjs.compare(
      password,
      user.password || "" // to avoid error if the user does not exist
    );

    if (!user || !isPasswordRight) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // clearing the cookie
    res.status(200).json({ message: "Logged Out User Successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
