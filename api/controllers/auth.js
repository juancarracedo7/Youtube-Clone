import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt); // contrasena hasheada
    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  console.log(req.body);

  try {
    const user = await User.findOne({ name: req.body.name }); // encuentro a usuario por su nombre
    !user && res.status(400).json("Wrong username or password"); // si no lo encuentro algo esta mal

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    ); // compraro las password

    !validPassword && res.status(400).json("Wrong password"); // mal la contrasena

    const token = jwt.sign({ id: user._id }, process.env.JWT); // necesito algo unico e irrepetible como el id
    const { password, ...otherInfo } = user._doc; // me traigo toda la info menos la password
    res
      .cookie("acces_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(otherInfo); // devuelvo el user
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("acces_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
        const newUser = new User({
            ...req.body,
            fromGoogle:true
        })
        const savedUser = await newUser.save()
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("acces_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (error) {
    next(error);
  }
};
