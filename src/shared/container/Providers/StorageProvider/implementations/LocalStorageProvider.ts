import { IStorageProvider } from "../IStorageProvider";
import { deleteFile } from '@utils/fileDelete';
import fs from 'fs';
import { resolve } from 'path';
import multerConfig from '@config/upload';

class LocalStorageProvider implements IStorageProvider {

    async save(file: string, folder: string): Promise<string> {
        await fs.promises.rename(
            resolve(multerConfig.directory, file), // FROM
            resolve(`${multerConfig.directory}/${folder}`, file) // PARA ONDE
        );

        return file;
    }

    async delete(file: string, folder: string): Promise<void> {
        const filePath = resolve(`${multerConfig.directory}/${folder}`, file);

        await deleteFile(filePath);
    }
}

export { LocalStorageProvider };