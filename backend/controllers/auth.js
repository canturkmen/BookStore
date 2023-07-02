const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const taxID = req.body.taxID;
  const address = req.body.address;
  const role = req.body.role;

  try {
    const hashedPass = await bcrypt.hash(password, 12);

    const customer = new User({
      username: username,
      email: email,
      password: hashedPass,
      taxID: taxID,
      address: address,
      role: role
    });

    await customer.save();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "turkmenc844@gmail.com",
      subject: "Welcome to Book Store",
      html: `<p>Hello ${customer.username},</p>
      <p>Thank you for signing up. Now, you can make orders and make comments to books.</p>
      <p>Regards,</p>
      <p>Book Shop</p>`,
    };
    
    await sgMail.send(msg);

    res.status(201).json({ message: "User Created!", userId: customer._id });
  } catch (err) {
    console.log(err);
  }
};

exports.signin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const customer = await User.findOne({ email: email });
    if (!customer) {
      console.log("There is no customer with this email!");
      return res
        .status(403)
        .json({ message: "There is no customer with this e-mail try again!" });
    }

    const isEqual = await bcrypt.compare(password, customer.password);
    if (!isEqual) {
      console.log("There is no customer with this password!");
      return res
        .status(403)
        .json({ message: "There is no customer with this password" });
    }

    const token = jwt.sign(
      {
        email: customer.email,
        userId: customer._id.toString(),
      },
      "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      userId: customer._id.toString(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("There is no customer with this id!");
      return res
        .status(403)
        .json({ message: "There is no customer with this id try again!" });
    }
    res.status(200).json({
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};