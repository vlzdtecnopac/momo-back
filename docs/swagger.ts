import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Documentación Momo",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://ec2-54-167-254-121.compute-1.amazonaws.com",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      user: {
        type: "object",
        required: ["name", "album", "cover", "artist", "duration", "mediaId"],
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
          },
        },
      },
      item: {
        type: "object",
        required: ["price", "qty"],
        properties: {
          price: {
            type: "string",
          },
          qty: {
            type: "string",
          },
        },
      },
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);