import { IStorageProvider } from "../IStorageProvider";
import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import multerConfig from "@config/upload";
import fs from 'fs';
import mime from 'mime';
import { deleteFile } from '@utils/fileDelete';

class S3StorageProvider implements IStorageProvider {

    private client: S3;

    constructor() {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION
        });
    }

    async save(file: string, folder: string): Promise<string> {
        const filePath = resolve(multerConfig.directory, file);

        const fileContent = await fs.promises.readFile(filePath);

        const fileType = mime.getType(filePath);

        await this.client.putObject({
            Bucket: `${process.env.AWS_BUCKET_NAME}/${folder}`,
            Key: file,
            ACL: 'public-read',
            Body: fileContent,
            ContentType: fileType
        }).promise();

        await deleteFile(filePath);

        return file;
    }

    async delete(file: string, folder: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: `${process.env.AWS_BUCKET_NAME}/${folder}`,
            Key: file,
        }).promise();
    }

}

export { S3StorageProvider };