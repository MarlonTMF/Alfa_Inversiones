import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TerrenoFuenteDatos } from './data/fuentes-datos/terreno.fuente-datos.js';
export declare class MapaConstructorModule implements OnModuleInit {
    private readonly terrenoRepo;
    constructor(terrenoRepo: Repository<TerrenoFuenteDatos>);
    onModuleInit(): Promise<void>;
}
