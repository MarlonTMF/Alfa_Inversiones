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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearTerrenoDto = void 0;
const class_validator_1 = require("class-validator");
class CrearTerrenoDto {
    id;
    ubicacion;
    precio;
    superficie;
    poligono;
    documentos_metadata;
}
exports.CrearTerrenoDto = CrearTerrenoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearTerrenoDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearTerrenoDto.prototype, "ubicacion", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearTerrenoDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CrearTerrenoDto.prototype, "superficie", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(3),
    __metadata("design:type", Array)
], CrearTerrenoDto.prototype, "poligono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearTerrenoDto.prototype, "documentos_metadata", void 0);
//# sourceMappingURL=crear-terreno.dto.js.map