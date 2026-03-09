"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapaConstructorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const terreno_fuente_datos_js_1 = require("./data/fuentes-datos/terreno.fuente-datos.js");
const terreno_repositorio_impl_js_1 = require("./data/repositorios/terreno.repositorio-impl.js");
const terreno_repositorio_js_1 = require("./domain/interfaces/terreno.repositorio.js");
const obtener_terrenos_caso_uso_js_1 = require("./domain/casos-uso/obtener-terrenos.caso-uso.js");
const terrenos_controlador_js_1 = require("./presentation/controladores/terrenos.controlador.js");
let MapaConstructorModule = class MapaConstructorModule {
    terrenoRepo;
    constructor(terrenoRepo) {
        this.terrenoRepo = terrenoRepo;
    }
    async onModuleInit() {
        const count = await this.terrenoRepo.count();
        if (count === 0) {
            await this.terrenoRepo.save([
                {
                    id: 'TER-001',
                    ubicacion: 'Zona Norte, Av. América',
                    precio: 1200000,
                    superficie: 1500,
                    poligono_json: JSON.stringify([
                        [-17.375, -66.1575],
                        [-17.375, -66.156],
                        [-17.3765, -66.156],
                        [-17.3765, -66.1575],
                    ]),
                },
                {
                    id: 'TER-002',
                    ubicacion: 'Zona Sur, Calle Baptista',
                    precio: 850000,
                    superficie: 800,
                    poligono_json: JSON.stringify([
                        [-17.41, -66.155],
                        [-17.41, -66.153],
                        [-17.412, -66.153],
                        [-17.412, -66.155],
                    ]),
                },
                {
                    id: 'TER-003',
                    ubicacion: 'Tiquipaya, Av. Ecológica',
                    precio: 450000,
                    superficie: 2000,
                    poligono_json: JSON.stringify([
                        [-17.34, -66.215],
                        [-17.34, -66.212],
                        [-17.342, -66.212],
                        [-17.342, -66.215],
                    ]),
                },
                {
                    id: 'TER-004',
                    ubicacion: 'Sacaba, Zona Central',
                    precio: 320000,
                    superficie: 600,
                    poligono_json: JSON.stringify([
                        [-17.395, -66.04],
                        [-17.395, -66.038],
                        [-17.397, -66.038],
                        [-17.397, -66.04],
                    ]),
                },
            ]);
            console.log('✅ Datos semilla de terrenos insertados');
        }
    }
};
exports.MapaConstructorModule = MapaConstructorModule;
exports.MapaConstructorModule = MapaConstructorModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([terreno_fuente_datos_js_1.TerrenoFuenteDatos])],
        controllers: [terrenos_controlador_js_1.TerrenosControlador],
        providers: [
            {
                provide: terreno_repositorio_js_1.TERRENO_REPOSITORIO,
                useClass: terreno_repositorio_impl_js_1.TerrenoRepositorioImpl,
            },
            obtener_terrenos_caso_uso_js_1.ObtenerTerrenosCasoUso,
        ],
    }),
    __param(0, (0, typeorm_2.InjectRepository)(terreno_fuente_datos_js_1.TerrenoFuenteDatos)),
    __metadata("design:paramtypes", [typeorm_3.Repository])
], MapaConstructorModule);
//# sourceMappingURL=mapa_constructor.module.js.map