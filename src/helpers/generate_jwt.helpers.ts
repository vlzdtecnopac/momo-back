import * as jwt from "jsonwebtoken";

export const generateAuthToken = (Id: string) => {
    const secretKey: jwt.Secret = process.env.SECRETORPRIVATEKEY || "MOMO123456";
    const expiresIn = "8h";
  
    const payload = {
        uid: Id
    };
  
    const token = jwt.sign(payload, secretKey, { expiresIn });
  
    return token;
  };