import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

import { AppError } from '../utils/app.error.js';

const generateTokens = async (userID, role) => {
  // Access token
  const accessToken = jwt.sign({ id: userID, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m"
  });

  // Refresh token
  const refreshToken = jwt.sign({ id: userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userID, refreshToken) => {
  await redis.set(
    `refresh_token:${userID}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

export const signUpService = async (userData) => {

  const { firstName, lastName, email, password } = userData;
  const newUser = new User({ firstName, lastName, email, password, role: "customer" });
  const savedUser = await newUser.save();

  // authenticate
  const { accessToken, refreshToken } = await generateTokens(savedUser._id, savedUser.role);
  await storeRefreshToken(savedUser._id, refreshToken);

  return { user: savedUser, accessToken, refreshToken };

};

export const signInService = async (userData) => {
  const { email, password } = userData;
  const existingUser = await User.findOne({ email });

  // Checking if user exist and if the password correct!
  if (existingUser && (await existingUser.comparePassword(password))){

    const { accessToken, refreshToken } = await generateTokens(existingUser._id, existingUser.role);
    await storeRefreshToken(existingUser._id, refreshToken);
    return { user: existingUser, accessToken, refreshToken };

  }else{
    throw new AppError("Incorrect email or password", 401);
  }
};
