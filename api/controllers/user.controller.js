import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import UserModel from '../models/user.model.js';

export const test = (req, res) => {
    
};

// Update user 
export const updateUser = async (req, res, next) => {
    
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account!"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: { 
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },
            {
                new: true,
            }
        );
        
        const { password, ...rest } = updatedUser._doc; 
        res.status(200).json(updatedUser);

    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your account!"));
    }

    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}