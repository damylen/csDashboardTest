import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './src/app.module';
import * as cors from 'cors';

const CS_SERVER_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(cors());
  await app.listen(CS_SERVER_PORT);
}
bootstrap();
