import { IUser, ROLE } from "../user/user.interface";
import { User } from "../user/user.model";
import { hashPassword, verifyPassword } from "../../utils/password";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes";
import { createTokens } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { generateToken, verifyToken } from "../../utils/jwt";

const registerUser = async (payload: Partial<IUser>) => {
    const { name, email, password: plainPassword, interests } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatusCode.CONFLICT, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(plainPassword as string);

    const result = await User.create({
        name,
        email,
        password: hashedPassword,
        role: ROLE.USER,
        interests,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = result.toObject();

    return user;
};

const login = async (payload: Partial<IUser>) => {
    const { email, password: plainPassword } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    const isVerifiedPassword = await verifyPassword(plainPassword as string, isUserExist.password);

    if (!isVerifiedPassword) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Incorrect password");
    }

    const tokens = createTokens(isUserExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = isUserExist.toObject();

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: rest,
    };
};


const getAccessToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN_SECRET);

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User does not exist");
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_TOKEN_SECRET,
        envVars.JWT_ACCESS_TOKEN_EXPIRES_IN
    );

    return {
        accessToken,
    };
};

const getMe = async (userId: string) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProfile } = isUserExist.toObject();

    return userProfile;
};

export const AuthService = {
    registerUser,
    login,
    getAccessToken,
    getMe
};
