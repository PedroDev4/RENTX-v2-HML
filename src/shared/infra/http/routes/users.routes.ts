import { Router } from "express";
import multer from "multer";

import multerConfig from "@config/upload";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreateUserController } from "@modules/accounts/useCases/createUser/CreateUserController";
import { UpdateUserAvatarController } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController";
import { FindUserByEmailAndDriverLicenseController } from "@modules/accounts/useCases/findUserByEmailDriverLicense/FindUserByEmailAndDriverLicenseController";

const userRoutes = Router();

const uploadAvatar = multer(multerConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const findUserByEmailAndDriverLicense = new FindUserByEmailAndDriverLicenseController();

userRoutes.post("/", createUserController.handle);

userRoutes.patch(
    "/avatar",
    ensureAuthenticated,
    uploadAvatar.single("avatar"),
    updateUserAvatarController.handle
);

userRoutes.get("/find/email-driverLicense", findUserByEmailAndDriverLicense.handle);

export { userRoutes };
