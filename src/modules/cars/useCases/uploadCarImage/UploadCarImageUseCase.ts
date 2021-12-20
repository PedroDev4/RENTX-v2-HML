import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { inject, injectable } from "tsyringe";
import { deleteFile } from "@utils/fileDelete";
import multerConfig from "@config/upload"
import fs from "fs";
import { IStorageProvider } from "@shared/container/Providers/StorageProvider/IStorageProvider";


interface IRequest {
    car_id: string;
    images_name: string[];
}

@injectable()
class UploadCarImageUseCase {

    constructor(
        @inject("CarsImagesRepository")
        private carsImagesRepository: ICarsImagesRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {
        //
    }

    async execute({ car_id, images_name }: IRequest): Promise<void> {
        // Receberemos um array de ImagesName
        const filesStorage = multerConfig.storage;

        images_name.map(async (image) => {
            const imageExists = fs.existsSync(`${filesStorage}/${image}`);

            if (imageExists) {
                await deleteFile(`${filesStorage}/${image}`);
            }

            await this.carsImagesRepository.create(
                car_id,
                image
            );

            await this.storageProvider.save(image, 'cars');
        });

    }

}

export { UploadCarImageUseCase }