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
exports.ConsultaAmenidadesDto = void 0;
const class_validator_1 = require("class-validator");
class ConsultaAmenidadesDto {
    lat;
    lng;
    radio;
    tipo;
}
exports.ConsultaAmenidadesDto = ConsultaAmenidadesDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], ConsultaAmenidadesDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], ConsultaAmenidadesDto.prototype, "lng", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ConsultaAmenidadesDto.prototype, "radio", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['mercado', 'transporte', 'colegio', 'hospital']),
    __metadata("design:type", String)
], ConsultaAmenidadesDto.prototype, "tipo", void 0);
//# sourceMappingURL=consulta-amenidades.dto.js.map