"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const seed_service_1 = require("./database/seeds/seed.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        console.log('Seeding database...');
        const seedService = app.get(seed_service_1.SeedService);
        await seedService.seed();
        console.log('Seeding completed!');
        await app.close();
    }
    catch (error) {
        console.error('Seeding failed!', error);
        await app.close();
        process.exit(1);
    }
    const server = await core_1.NestFactory.create(app_module_1.AppModule);
    server.use((0, helmet_1.default)());
    server.enableCors();
    server.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Corporate Performance Management API')
        .setDescription('API for the Corporate Performance Management Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(server, config);
    swagger_1.SwaggerModule.setup('api', server, document);
    await server.listen(3000);
    console.log(`Application is running on: ${await server.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map