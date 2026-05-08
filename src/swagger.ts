import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import e = require("express");

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API",
            version: "1.0.0",
            description: "Simple Express API documentation",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },

    // files containing annotations
    apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: e.Application) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}