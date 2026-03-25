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
exports.ObtenerTerrenosCasoUso = void 0;
const common_1 = require("@nestjs/common");
const terreno_repositorio_js_1 = require("../interfaces/terreno.repositorio.js");
let ObtenerTerrenosCasoUso = class ObtenerTerrenosCasoUso {
    terrenoRepositorio;
    constructor(terrenoRepositorio) {
        this.terrenoRepositorio = terrenoRepositorio;
    }
    async ejecutar(bbox) {
        return this.terrenoRepositorio.buscarPorBoundingBox(bbox);
    }
};
exports.ObtenerTerrenosCasoUso = ObtenerTerrenosCasoUso;
exports.ObtenerTerrenosCasoUso = ObtenerTerrenosCasoUso = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(terreno_repositorio_js_1.TERRENO_REPOSITORIO)),
    __metadata("design:paramtypes", [Object])
], ObtenerTerrenosCasoUso);
//# sourceMappingURL=obtener-terrenos.caso-uso.js.map