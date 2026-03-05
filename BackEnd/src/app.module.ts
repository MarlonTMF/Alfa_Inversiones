import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapaConstructorModule } from './mapa_constructor/mapa_constructor.module';

@Module({
  imports: [MapaConstructorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
