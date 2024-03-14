import { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

if (process.env.NODE_ENV === "development") {
    require('dotenv').config({ path: ".env.development" });
  } else if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: ".env.production" });
}


const accessKeyId: any = process.env.AWS_PUBLIC_KEY;
const secretAccessKey: any = process.env.AWS_SECRET_KEY;
const region: any = process.env.AWS_BUCKET_REGION;

console.log("aqui: " + accessKeyId);
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

async function uploadFileArchive(file: any) {
    const fileContent = fs.createReadStream(file.tempFilePath);
 
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name,
        Body: fileContent
    };

    try {
        const data: any = await s3Client.send(new PutObjectCommand(params));
        console.log("Archivo cargado exitosamente en S3:", data.Location);
    } catch (err) {
        console.error("Error al subir el archivo a S3:", err);
        throw err; // Lanza el error para manejarlo en la función de llamada
    }
}