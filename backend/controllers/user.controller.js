import  User  from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

       
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

       
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        
        await User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: hashedPassword,
            role: req.body.role || "user",
            profile: { profilePhoto: cloudResponse.secure_url },
        });

        return res.status(201).json({ message: "Account created successfully", success: true });
    } catch (error) {
        console.error("Error in register function:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };

        const tokenData = {
            userId: user._id,
            role: user.role  // Include the role in the token payload
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
            role: user.role // Include role in the response
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullname, phoneNumber, password, bio } = req.body;
        let user = await User.findById(userId);
        
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }
        
        if (fullname) user.fullname = fullname;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        
        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            
            // Delete old profile picture from Cloudinary if it exists
            if (user.profile.profilePhoto) {
                const oldImagePublicId = user.profile.profilePhoto.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(oldImagePublicId);
            }
            
            user.profile.profilePhoto = cloudResponse.secure_url;
        }
        
        await user.save();
        
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profile: user.profile
            },
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};


export const checkLoginStatus = async (req, res) => {
    try {
        if (!req.id) {  // Change from req.user to req.id
            return res.status(401).json({
                message: "User not logged in",
                success: false,
            });
        }

        const user = await User.findById(req.id).select("-password"); // Exclude password for security

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User is logged in",
            user, // Send user data
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

