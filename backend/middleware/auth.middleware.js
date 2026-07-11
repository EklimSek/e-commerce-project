import jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(401).json({success: false, message: "Unauthorized - No access token"})
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            const user = await User.findById(decoded.id).select("-password");
    
            if(!user){
                return res.status(401).json({ success: false, message: "Unauthorized - User not found"})
            }
    
            req.user = user;
            next();
            
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({success: false, message: "Unauthorized - Access token expired"})
            }
            throw new Error
        }

    } catch (error) {
        console.log("Error in protect middleware: ", error.message)
        return res.status(500).json({success: false, message: error.message})
    }
} 

export const adminOnly = async (req, res, next) => {
    const role = req.user.role;

    if(!role || (role !== "admin")){
        return res.status(403).json({ success: false, message: "Unauthorized - Admin only!" })
    }

    next()
}