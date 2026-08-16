import { IUser, ROLE } from "./user.interface";
import { User } from "./user.model";
import { hashPassword } from "../../utils/password";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {
    const { name, email, password: plainPassword, role, interests } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatusCode.CONFLICT, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(plainPassword as string);

    const result = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || ROLE.USER,
        interests,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = result.toObject();

    return user;
};

export const UserService = {
    createUser,
};
