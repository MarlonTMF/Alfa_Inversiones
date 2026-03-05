import { Module } from '@nestjs/common';
import { MapaConstructorController } from './mapa_constructor.controller';
import { MapaConstructorService } from './mapa_constructor.service';

@Module({
  controllers: [MapaConstructorController],
  providers: [MapaConstructorService]
})
export class MapaConstructorModule {}
