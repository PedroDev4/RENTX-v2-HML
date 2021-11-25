import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import auth from "@config/auth";

interface ITokenPayLoad {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token Missing!", 401);
    }

    // ["Bearer","Jyeisjaeesajn32u3kskj2sa"];
    // [0]  = Bearer
    // [1] = Jyeisjaeesajn32u3kskj2sa
    const [, token] = authHeader.split(" ");

    // Verify if token is valid

    const usersRepository = new UsersRepository();

    try {
        const { sub: user_id } = verify(
            token,
            auth.secret_token
        ) as ITokenPayLoad;

        const user = await usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User does not exists', 401);

        } else if (!user.isVerified) {

            throw new AppError('User is not verified', 401);
        }

        request.user = {
            // Passando o obejeto "user" para nossa requisição "pra frente"
            id: user_id,
        };

        next();
    } catch (err) {
        throw new AppError(`Invalid Token. ${err.message}`, 401);
    }
}
