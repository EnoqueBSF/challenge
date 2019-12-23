const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authConfig = require("../../config/auth");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

router.post("/user", async (req, res) => {
  const { email, cnpj } = req.body;

  try {
    if (await User.findOne({ email, cnpj }))
      return res.status(400).send({ error: "User already exists" });

    const user = await User.create(req.body);

    user.password = undefined;

    return res.status(201).send({
      user,
      token: generateToken({ id: user.id })
    });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    return res.status(200).send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Error loading user" });
  }
});

router.get("/user/", async (req, res) => {
  try {
    const users = await User.find().select("+password");

    return res.status(200).send({ users });
  } catch (err) {
    return res.status(400).send({ error: "Error loading user's" });
  }
});

router.post("/auth/sign_in", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "User not found" });

  if (!(await (password == user.password)))
    return res.status(400).send({ error: "Invaid password" });

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 86400
  });

  res.status(200).send({
    user,
    token: generateToken({ id: user.id })
  });
});

/*
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send({ error: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });

    console.log(token, now);
  } catch (err) {
    res.status(400).send({ error: "Erro on forgot password, try again" });
  }
});
*/

module.exports = app => app.use("/api/v1", router);
