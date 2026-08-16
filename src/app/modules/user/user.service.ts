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

const getSingleUser = async (id: string) => {
    const isUserExist = await User.findById(id);

    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = isUserExist.toObject();

    return user;
};

const getUsersGroupedByInterests = async () => {
    const result = await User.aggregate([
        {
            $unwind: "$interests",
        },
        {
            $group: {
                _id: "$interests",
                count: {
                    $sum: 1,
                },
                users: {
                    $push: {
                        userId: "$_id",
                        name: "$name",
                        email: "$email",
                        role: "$role",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                interest: "$_id",
                count: 1,
                users: 1,
            },
        },
    ]);

    return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
    const { name, email, password: plainPassword, role, interests } = payload;

    const isUserExist = await User.findById(id);

    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    if (email) {
        const isEmailTaken = await User.findOne({ email, _id: { $ne: id } });

        if (isEmailTaken) {
            throw new AppError(httpStatusCode.CONFLICT, "User with this email already exists");
        }
    }

    const updatedData: Partial<IUser> = { name, email, role, interests };

    if (plainPassword) {
        updatedData.password = await hashPassword(plainPassword);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = updatedUser.toObject();

    return user;
};

const deleteUser = async (id: string) => {
    const isUserExist = await User.findById(id);

    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User doesn't exist");
    }

    return null;
};

export const UserService = {
    createUser,
    getSingleUser,
    getUsersGroupedByInterests,
    updateUser,
    deleteUser,
};
