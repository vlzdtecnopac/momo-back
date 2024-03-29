import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { LoggsConfig } from "../config/logs";

if (process.env.NODE_ENV === "development") {
    require("dotenv").config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
    require("dotenv").config({ path: ".env.production" });
}
const loggsConfig: LoggsConfig = new LoggsConfig();

const accessKeyId: any = process.env.AWS_PUBLIC_KEY;
const secretAccessKey: any = process.env.AWS_SECRET_KEY;
const region: any = process.env.AWS_BUCKET_REGION;

const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});


export async function getFilesURL(){
    const command = new ListObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME
    });
    return await s3Client.send(command);
}


export async function uploadFileArchive(file: any) {
    const fileContent = fs.createReadStream(file.tempFilePath);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name,
        Body: fileContent
    };

    try {
        const data: any = await s3Client.send(new PutObjectCommand(params));
        loggsConfig.log(`Archivo cargado exitosamente en S3: ${data}`);
    } catch (err) {
        loggsConfig.log(`Error al subir el archivo a S3:" ${err}`);
        throw err; 
    }
}


export async function getFileGenerateURL(fileName: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 28800 });
}


export async function deleteFileUrl(fileName: any){
    try {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
        };
    
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
       return `Imagen ${fileName} eliminada exitosamente.`;
      } catch (error) {
        return "Error al eliminar la imagen:" +  error;
      }
}

