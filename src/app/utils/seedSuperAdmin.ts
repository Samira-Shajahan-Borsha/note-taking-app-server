import { envVars } from "../config/env";
import { ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { hashPassword } from "./password";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("Super admin already exists");
            return;
        }

        await User.create({
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: await hashPassword(envVars.SUPER_ADMIN_PASSWORD),
            role: ROLE.ADMIN,
            interests: [],
        });

        console.log("Super admin created successfully");
    } catch (error) {
        console.error("Error while seeding super admin:", error);
    }
};
