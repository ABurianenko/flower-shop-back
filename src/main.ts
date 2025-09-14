import { initMongoDB } from "./db/initMongoDB";
import { App } from "./infra/App";

const app = new App();

const bootstrap = async () => {
    await initMongoDB();
    app.init();
}

bootstrap();
