const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
const converter = require("../utils/converter");

const createAccessToken = (payload, expiresIn) => {
  const token = jwt.sign(
    {
      data: payload,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: expiresIn }
  );
  return token;
};

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // Save mongodb
      await newUser.save();
      const accesstoken = createAccessToken({ id: newUser._id }, "3d");
      const data = {
        from: "info@newlabelproduction.com",
        to: email,
        subject: "Welcome to New Label Tv",
        text: "",
        html: `<!DOCTYPE html>
        <html>
        <head>
          <title>Welcome to New Label Tv</title>
        </head>
        <body>
          <h1>Welcome to New Label Tv</h1>
          <p>Thank you for signing up. Please click the link below to verify your email address:</p>
          <a href="https://newlabeltvstage.netlify.app/verify-email?token=${accesstoken}">
        Verify Email
      </a>
          <p>If you did not sign up for our service, please ignore this email.</p>
        </body>
        </html>`,
      };
      await sendMail(data);
      res.status(200).json({
        msg: "registration successful, please check your email address for a verification mail",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      const accesstoken = createAccessToken({ id: user._id }, "3d");
      const data = {
        from: "info@newlabelproduction.com",
        to: email,
        subject: "Welcome to New Label Tv",
        text: "",
        html: `<!DOCTYPE html>
        <html>
        <head>
          <title>Welcome to New Label Tv</title>
        </head>
        <body>
          <h1>Welcome to New Label Tv</h1>
          <p>Thank you for signing up. Please click the link below to verify your email address:</p>
          <a href="https://newlabeltvstage.netlify.app/verify-email?token=${accesstoken}">
        Verify Email
      </a>
          <p>If you did not sign up for our service, please ignore this email.</p>
        </body>
        </html>`,
      };
      await sendMail(data);
      res.status(200).json({
        msg: "email verification sent",
      });
    } catch (err) {
      res.status(500).json({
        msg: err?.message,
      });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) res.status(400).json({ msg: "please provide token" });
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (error, decoded) => {
          if (error) {
            if (error.name === "TokenExpiredError") {
              // Token has expired
              return res.status(400).json({ msg: "token expired" });
            } else if (error.name === "JsonWebTokenError") {
              // Invalid token
              return res.status(400).json({ msg: "Invalid Token" });
            } else {
              // Other JWT verification errors
              res.status(500).json({ msg: error.message });
            }
          } else {
            const user = await Users.findByIdAndUpdate(
              { _id: decoded.data.id },
              { isEmailVerified: true }
            );
            return res.status(200).json({ msg: "email verified" });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });
      if (!user.isEmailVerified)
        res.status(200).json({ msg: "email is not verified", verified: false });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id }, "3d");
      const walletValue = await converter(user.wallet, req.currency);
      res.status(200).json({
        accesstoken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          wallet: walletValue,
        },
        verified: true,
        isDefaultPassword: user.isDefaultPassword,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMe: async (req, res) => {
    try {
      const user = await Users.findById(req.id)
        .select("-createdAt -updatedAt -__v -password -role")
        .lean();
      const walletValue = await converter(user.wallet, req.currency);
      console.log(walletValue, user.wallet, req.currency);
      res.status(200).json({
        msg: "success",
        data: { ...user, wallet: walletValue },
        currency: req.currency,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name } = req.body;
      await Users.findByIdAndUpdate({ _id: req.id }, { name });
      res.json({
        msg: "Successfully updated profile",
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const user = await Users.findById(req.id).select(
        "-createdAt -updatedAt -__v"
      );
      const isMatch = bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await Users.findByIdAndUpdate(
        { _id: user._id },
        { password: passwordHash, isDefaultPassword: false }
      );
      res.status(200).json({
        msg: "Successfully updated password",
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({
        user_id: req.user.id,
        paymentType: { $ne: "donation" },
      });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "email not registered." });
      const accesstoken = createAccessToken({ id: user._id }, "4h");
      const data = {
        from: "info@newlabelproduction.com",
        to: user.email,
        subject: "Password Reset Mail",
        text: "",
        html: user?.role
          ? `<a href='https://newllabeltv.netlify.app/reset_password?token=${accesstoken}'>click here to reset your password</a>`
          : `<a href='https://newlabeltvstage.netlify.app/changepassword?token=${accesstoken}'>click here to reset your password</a>`,
      };
      const status = await sendMail(data);
      if (status)
        res
          .status(200)
          .json({ msg: `password reset email has been sent to ${email}` });
      if (!status)
        res
          .status(500)
          .json({ msg: "An unexpected error occured with mail provider" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token) res.status(400).json({ msg: "please provide token" });
      if (!password) res.status(400).json({ msg: "please provide password" });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });
      const passwordHash = await bcrypt.hash(password, 10);
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (error, decoded) => {
          if (error) {
            if (error.name === "TokenExpiredError") {
              // Token has expired
              return res.status(400).json({ msg: "token expired" });
            } else if (error.name === "JsonWebTokenError") {
              // Invalid token
              return res.status(400).json({ msg: "Invalid Token" });
            } else {
              // Other JWT verification errors
              res.status(500).json({ msg: error.message });
            }
          } else {
            const user = await Users.findByIdAndUpdate(
              { _id: decoded.data.id },
              { password: passwordHash, isDefaultPassword: false }
            );
            return res
              .status(200)
              .json({ msg: "password updated successfully" });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
