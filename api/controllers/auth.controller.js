import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

/**
 * This is the sign up controller function.
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        next(error);
    }
}

/**
 * This is the sign in controller function.
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'Invalid credentials'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Invalid credentials'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);

        const { password: hashedPassword, ...rest } = validUser._doc;

        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

        res
            .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}

/**
 * This is the google controller function. 
 * This function helps us to save user data once we have got them from google to also keep a copy of the signed in user in the database.
 * If the user has already signed in with google once, the function will not save the user afresh. It will return the user's information just like the other sign in mechanism.
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET_KEY);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000);
            res
                .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
}

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout Success!');
};