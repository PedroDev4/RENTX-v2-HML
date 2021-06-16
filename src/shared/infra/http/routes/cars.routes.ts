import { Router } from 'express';
import multer from "multer";
import multerConfig from "@config/upload";
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { UploadCarImageController } from '@modules/cars/useCases/uploadCarImage/UploadCarImageController';

const upload = multer(multerConfig);

const carRoutes = Router();
const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImageController();

carRoutes.post("/", ensureAuthenticated, ensureAdmin, createCarController.handle);
carRoutes.post("/images/:id", ensureAuthenticated, ensureAdmin, upload.array('images'), uploadCarImagesController.handle);
carRoutes.get("/available", listAvailableCarsController.handle);
carRoutes.post("/specifications/:car_id", ensureAuthenticated, ensureAdmin, createCarSpecificationController.handle);


export { carRoutes };