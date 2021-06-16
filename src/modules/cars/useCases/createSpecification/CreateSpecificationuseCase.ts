import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { Specification } from "@modules/cars/infra/typeorm/model/Specification";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateSpecificationuseCase {
    constructor(
        @inject("SpecificationsRepository")
        private specificationsRepository: ISpecificationsRepository
    ) {
        //
    }

    async execute({ name, description }: IRequest): Promise<Specification> {
        const specificationAlreadyExists = await this.specificationsRepository.findByName(
            name
        );

        if (specificationAlreadyExists) {
            throw new AppError("Specification Already Exists!");
        }

        const specification = await this.specificationsRepository.create({
            name,
            description,
        });

        return specification;
    }
}

export { CreateSpecificationuseCase };
