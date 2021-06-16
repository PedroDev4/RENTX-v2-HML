import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import createConnection from "../database"
import "@shared/container";
import swaggerUi from "swagger-ui-express";
import { AppError } from "@shared/errors/AppError";

import { router } from "./routes";
import swaggerFile from "./../../../swagger.json";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Passando Rota para acessar a Doc, Passando o Server Swagger, e o setup do swagger

app.use(router);

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            // Se o erro for insancia do AppError
            return response // Retorna resposta com o statusCode e a message do erro vindo do AppError
                .status(err.statusCode)
                .json({ message: err.message });
        }
        return response.status(500).json({
            status: "error",
            message: `Internal Server Error ${err.message}`,
        });
    }
);

app.listen(3333, () => console.log("Server is running!"));
