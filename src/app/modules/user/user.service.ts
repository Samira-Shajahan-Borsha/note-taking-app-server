import { IUser } from "./user.interface";
import { User } from "./user.model";
import { hashPassword } from "../../utils/password";

const createUser = async (payload: Partial<IUser>) => {
    const { name, email, password: plainPassword, interests } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(plainPassword as string);

    const result = await User.create({
        name,
        email,
        password: hashedPassword,
        interests,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = result.toObject();

    return user;
};

export const UserService = {
    createUser,
};
