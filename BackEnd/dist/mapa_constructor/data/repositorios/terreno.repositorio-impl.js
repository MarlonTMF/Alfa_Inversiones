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
exports.TerrenoRepositorioImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const terreno_fuente_datos_js_1 = require("../fuentes-datos/terreno.fuente-datos.js");
let TerrenoRepositorioImpl = class TerrenoRepositorioImpl {
    terrenoRepo;
    constructor(terrenoRepo) {
        this.terrenoRepo = terrenoRepo;
    }
    async buscarPorBoundingBox(bbox) {
        const terrenos = await this.terrenoRepo.find();
        return terrenos
            .filter((terreno) => terreno.poligono.some(([lat, lng]) => lat >= bbox.minLat &&
            lat <= bbox.maxLat &&
            lng >= bbox.minLng &&
            lng <= bbox.maxLng))
            .map((terreno) => ({
            id: terreno.id,
            ubicacion: terreno.ubicacion,
            precio: terreno.precio,
            superficie: terreno.superficie,
            poligono: terreno.poligono,
        }));
    }
};
exports.TerrenoRepositorioImpl = TerrenoRepositorioImpl;
exports.TerrenoRepositorioImpl = TerrenoRepositorioImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(terreno_fuente_datos_js_1.TerrenoFuenteDatos)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TerrenoRepositorioImpl);
//# sourceMappingURL=terreno.repositorio-impl.js.map