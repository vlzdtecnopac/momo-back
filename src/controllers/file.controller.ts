import { Request, Response } from "express";
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import fs from "fs";

if (process.env.NODE_ENV === "development") {
    require("dotenv").config({ path: ".env.development" });
  } else if (process.env.NODE_ENV === "production") {
    require("dotenv").config({ path: ".env.production" });
  }
  
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


export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No se ha subido ningún archivo" });
        }
        const file = req.files.file;
        await uploadFileArchive(file);
        res.status(200).json("Archivo subido exitosamente a S3");
    } catch (err) {
        console.error("Error al subir el archivo a S3:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getFile = async(req: Request, res: Response) => {
    const result = await getFileGenerateURL(req.params.fileName);
    return res.status(200).json({
        url: result
    });
}

export const getFiles =  async (req: Request, res: Response) => {
    const result =  await getFilesURL();
    return res.status(200).json(result.Contents);
}

async function getFilesURL(){
    const command = new ListObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME
    })
    return await s3Client.send(command);
}



async function uploadFileArchive(file: any) {
    const fileContent = fs.createReadStream(file.tempFilePath);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name,
        Body: fileContent
    };

    try {
        const data: any = await s3Client.send(new PutObjectCommand(params));
        console.log("Archivo cargado exitosamente en S3:", data);
    } catch (err) {
        console.error("Error al subir el archivo a S3:", err);
        throw err; // Lanza el error para manejarlo en la función de llamada
    }
}


async function getFileGenerateURL(filename: any) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
    })
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}