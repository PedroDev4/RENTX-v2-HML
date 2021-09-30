import { Router } from "express";

import { AuthenticateUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";
import { ConfirmUserVerifyEmailController } from "@modules/accounts/useCases/confirmUserVerifyEmail/ConfirmUserVerifyEmailController";
import { ConfirmUserValidationController } from "@modules/accounts/useCases/confirmUserValidation/ConfirmUserValidationController";

const authenticateRoutes = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();
const confirmUserVerifyEmailController = new ConfirmUserVerifyEmailController();
const confirmUserValidationController = new ConfirmUserValidationController();

authenticateRoutes.post("/", authenticateUserController.handle);
authenticateRoutes.post("/refresh-token", refreshTokenController.handle);
authenticateRoutes.post("/verifyEmail/:id", confirmUserVerifyEmailController.handle);
authenticateRoutes.put("/confirmUser", confirmUserValidationController.handle);

export { authenticateRoutes };
