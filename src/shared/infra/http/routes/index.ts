import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { categoriesRoutes } from "./categories.routes";
import { specificationRoutes } from "./specification.routes";
import { userRoutes } from "./users.routes";
import { carRoutes } from './cars.routes';

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationRoutes);
router.use("/users", userRoutes);
router.use("/sessions", authenticateRoutes);
router.use("/cars", carRoutes)

export { router };
