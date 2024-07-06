const User = require("../models/user.model.js");

const generateTokens = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (err) {
    console.log("Error while generating tokens: ", err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json("Fill in all details");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json("Incorrect email or password");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ user });
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

const logout = async (req, res) => {
  const user = await User.findById(req.user._id);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json("logout successfully");
};

const register = async (req, res) => {
  try {
    const { email, password, fullName} = req.body;
    if (!email || !password || !fullName ) {
      return res.status(401).json("Fill in details");
    }
    if (await User.findOne({ email })) {
      return res.status(401).json("User already exists");
    }

    const user = await User.create({ email, password, fullName});
    if (user) return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("pictures");

    res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
}

module.exports = { login, logout, register, getInfo };
