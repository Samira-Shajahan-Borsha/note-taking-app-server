import bcrypt from "bcryptjs";
import { envVars } from "../config/env";

export const hashPassword = (plainPassword: string): Promise<string> =>
    bcrypt.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));

export const verifyPassword = (plainPassword: string, hashedPassword: string): Promise<boolean> =>
    bcrypt.compare(plainPassword, hashedPassword);
