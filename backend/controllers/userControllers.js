const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, "CHATAPP");
    console.log(newUser, token);
    return res.json({ status: "ok", user: newUser, token: token });
  } catch (err) {
    console.log(err);
    return res.json({ status: "error", error: "Duplicate Email" });
  }
};

const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ id: user._id }, "CHATAPP");
        res.json({ status: "success", user: user, jwttoken: token });
      } else {
        res.json({ status: "error", error: "Invalid password" });
      }
    } else {
      res.json({ status: "error", error: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Invalid username or password" });
  }
};

const getChat = async (req, res) => {
  try {
    const ourUser = await User.findOne({ _id: req.user });
    if (ourUser) {
      res.json({ status: "ok", user: ourUser });
    } else {
      res.json({ status: "error", error: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getChat, registerUser, loginUser };
