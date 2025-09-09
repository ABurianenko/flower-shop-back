import "reflect-metadata";
import express from "express";
import {useExpressServer} from "routing-controllers";

import { IService } from "types/services";
import { controllers } from "app/domain";
import { middlewares } from "app/middlewares";
import { pinoHttp } from "pino-http";
import { getEnvVar } from "utils/getEnvVar";
import { getAllShops, getShopById } from "services/shops";
import { getFlowerById, getFlowersByShop } from "services/flowers";

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

        server.get('/shops', async (req, res) => {
            const shops = await getAllShops();

            res.status(200).json({
                data: shops,
            });
        });

        server.get('/shops/:shopId', async (req, res, next) => {
            const { shopId } = req.params;
            const shop = await getShopById(shopId);

            if (!shop) {
                res.status(404).json({
                    message: 'Shop not found'
                });
                return;
            }

            res.status(200).json({
                data: shop,
            });
        });

        server.get('/shops/:shopId/flowers', async (req, res, next) => {
            const { shopId } = req.params;
            const flowers = await getFlowersByShop(shopId);

            res.status(200).json({
                data: flowers,
            });
        });

        server.get('/flowers/:flowerId', async (req, res, next) => {
            const { flowerId } = req.params;
            const flower = await getFlowerById(flowerId);

            if (!flower) {
                res.status(404).json({
                    message: 'Flower not found',
                });
                return;
            };

            res.status(200).json({
                data: flower,
            })
        })

        server.use((_req, res) => {
            res.status(404).json({
                message: 'Not found',
            });
        });

        return new Promise<boolean>((resolve) => {
            server.listen(PORT, () => {
                console.log(`Tcp service started on port ${PORT}`);
                return resolve(true);
            })
        })
    }
}
