import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindUserByEmailAndDriverLicenceUseCase } from "./FindUserByEmailAndDriverLicenseUseCase";

class FindUserByEmailAndDriverLicenseController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { email, driver_license } = request.query;

        const findUserByEmailAndDriverLicenseUseCase = container.resolve(FindUserByEmailAndDriverLicenceUseCase);

        const user = await findUserByEmailAndDriverLicenseUseCase.execute(String(email), String(driver_license));

        return response.json(user);
    }

}

export { FindUserByEmailAndDriverLicenseController };