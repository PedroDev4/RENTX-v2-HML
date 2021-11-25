import multer from "multer";
import path from "path";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");
export default {
    directory: tmpFolder,
    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback) {
            //const fileHash = crypto.randomBytes(10).toString('hex');
            //const fileName = `${fileHash}-${file.originalname}`;

            const fileName = file.originalname;
            const fileNameParsed = fileName.replace(/\s+/g, '');

            return callback(null, fileNameParsed);
        }
    }),
}