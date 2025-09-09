import "reflect-metadata";
import express from "express";
import {useExpressServer} from "routing-controllers";

import { IService } from "types/services";
import { controllers } from "app/domain";
import { middlewares } from "app/middlewares";
import { pinoHttp } from "pino-http";
import { getEnvVar } from "utils/getEnvVar";

const PORT = Number(getEnvVar('PORT')) || 4000;

export class Tcp implements IService {
    private static instance: Tcp;

    private routePrefix = "/api"
    public server = express();

    constructor() {
        if (!Tcp.instance) {
            Tcp.instance = this;
        }

        return Tcp.instance;
    }

    async init() {
        const { server, routePrefix } = this;

        server.use(express.json());
        server.use(
            pinoHttp({
                transport: {
                    target: 'pino-pretty'
                }
            })
        )

        useExpressServer(server, {
            routePrefix,
            controllers,
            middlewares,
            cors: true,
            defaultErrorHandler: true,
            validation: false,
        });

        server.use((_req, res) => {
            res.status(404).json({
                message: 'Not found',
            });
        });

        return new Promise<boolean>((resolve) => {
            server.listen(PORT, () => {
                console.log("Tcp service started on port 4000");
                return resolve(true);
            })
        })
    }
}
