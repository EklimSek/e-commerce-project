import User from "../models/user.model.js";
import { signUpService, signInService } from "../services/auth.service.js";

import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

const setCookies = async (res, accessToken, refreshToken) => {

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF, cross site request forgery attackj
    maxAge: 15 * 60 * 1000 // 15 minutes
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF, cross site request forgery attackj
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

// controller handle HHTP request/response of User
export const signUp = async (req, res) => {
  // Verify
  const userData = req.body;
  if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide first name, last name, email, and password",
      });
  }

  try {
    // Checking if user exited
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        return res
        .status(400)
        .json({ success: false, message: "User already existed!!" });
    }
    
    const { user, accessToken, refreshToken } = await signUpService(userData);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ 
      success: true, 
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    }});

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "User already existed!!" });
    }
    console.error("Error in creating user: ", error.message);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

export const signIn = async (req, res) => {

    const userData = req.body;
    if (!userData.email || !userData.password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide email, and password",
      });
    }

    try{
        const { user, accessToken, refreshToken } = await signInService(userData);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({ success: true, user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }});
        
    }catch (error){
      if(error.isOperational){
        // Known, safe error — show the real message
        res.status(error.statusCode).json({ success: false, message: error.message });
      }else{
        // Unknown/unexpected — log internally, show generic message
        console.error("Error in logging user: ", error.message); // for debugging
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
      }
    }
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      await redis.del(`refresh_token:${decoded.id}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({success: true, message: "Logged out successfully"});

  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      // Token is invalid/expired — still clear cookies and let logout succeed
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ success: true, message: "Logged out successfully" });
    }

    console.log(`Error in logging out: ${error.message}`)
    res.status(500).json({ success: false, message: error.message})
    
  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      return res.status(401).json({success: false, message: "No refresh token provided!"})
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.id}`)

    if(storedToken !== refreshToken){
      return res.status(401).json({success: false, message: "Invalid Refresh Token"})
    }

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, {expiresIn: "15m"});

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevent CSRF, cross site request forgery attackj
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.status(200).json({success: true, message: "Token refresh successfully"})

  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }

    console.log("Error in refresh token controller", error.message)
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  }});
}