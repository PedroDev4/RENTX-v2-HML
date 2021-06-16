import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { getRepository, Repository } from "typeorm";
import { CarImage } from "../model/CarImage";
import crypto from "crypto";


class CarsImagesRepository implements ICarsImagesRepository {

    private repository: Repository<CarImage>;

    constructor() {
        this.repository = getRepository(CarImage);
    }

    async create(car_id: string, image_name: string): Promise<CarImage> {

        const hash = crypto.randomBytes(10).toString('hex');
        const hashImageName = `${hash}-${image_name}`;

        const carImage = this.repository.create({
            car_id,
            image_name: hashImageName
        });

        await this.repository.save(carImage);

        return carImage;
    }

    async findByImageName(image_name: string): Promise<CarImage> {
        const carImage = await this.repository.findOne({ image_name });
        return carImage;
    }

}

export { CarsImagesRepository };