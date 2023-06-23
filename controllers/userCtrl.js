const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");

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

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id }, "3d");

      res.json({
        accesstoken,
      });
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

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id }, "3d");

      res.json({
        accesstoken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          wallet: user.wallet,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findById({ _id: id }).select(
        "-password -createdAt -updatedAt -__v"
      );
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  makeUserAdmin: async (req, res) => {
    try {
      const { user_id } = req.body;
      const user = await Users.findByIdAndUpdate({ _id: user_id }, { role: 1 });

      res.json({
        msg: "Successfully made user an admin",
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
      const history = await Payments.find({ user_id: req.user.id });

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
      console.log(user);
      const data = {
        from: "info@newlabelproduction.com",
        to: user.email,
        subject: "Password Reset Mail",
        text: "",
        html: `<a href='https://newlabeltvstage.netlify.app/changepassword?token=${accesstoken}'>click here to reset your password</a>`,
      };
      const status = await sendMail(data);
      if (status)
        res
          .status(200)
          .json({ msg: `password reset email has been sent to ${email}` });
      if (!status) res.status(500).json({ msg: "An unexpected error occured" });
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
              { password: passwordHash }
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
