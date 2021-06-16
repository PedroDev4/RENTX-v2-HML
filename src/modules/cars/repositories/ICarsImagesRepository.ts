import { CarImage } from "../infra/typeorm/model/CarImage";


interface ICarsImagesRepository {

    create(car_id: string, image_name: string): Promise<CarImage>
    findByImageName(image_name: string): Promise<CarImage>

}

export { ICarsImagesRepository }