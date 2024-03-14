import * as jwt from "jsonwebtoken";

if (process.env.NODE_ENV === "development") {
    require('dotenv').config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: ".env.production" });
}

export const generateAuthToken = (Id: string) => {
    const secretKey: jwt.Secret = process.env.SECRETORPRIVATEKEY || "MOMO123456";
    const expiresIn = "8h";
  
    const payload = {
        uid: Id
    };
  
    const token = jwt.sign(payload, secretKey, { expiresIn });
  
    return token;
  };