const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userControllers");
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const secretKey = "CHATAPP";
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/chat", verifyToken, userController.getChat);
module.exports = router;
