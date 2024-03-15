import { Request, Response } from "express";
import { deleteFileUrl, getFileGenerateURL, getFilesURL, uploadFileArchive } from "../helpers/s3";

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ msg: "No se ha subido ningún archivo" });
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


export const deleteFile = async(req: Request, res: Response) => {
    const result =  await deleteFileUrl(req.params.fileName);
    return res.status(200).json(result);
}



