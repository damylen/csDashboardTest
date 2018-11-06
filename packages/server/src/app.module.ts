import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LayerController} from './layers/layer.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.db',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}']
    })
  ],
  controllers: [AppController, LayerController],
  providers: [AppService]
})
export class ApplicationModule {}
