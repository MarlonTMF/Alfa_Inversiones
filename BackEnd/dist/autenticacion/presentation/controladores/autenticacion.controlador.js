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
exports.AutenticacionControlador = void 0;
const common_1 = require("@nestjs/common");
const registrar_usuario_caso_uso_js_1 = require("../../domain/casos-uso/registrar-usuario.caso-uso.js");
const iniciar_sesion_caso_uso_js_1 = require("../../domain/casos-uso/iniciar-sesion.caso-uso.js");
const registro_usuario_dto_js_1 = require("../dto/registro-usuario.dto.js");
const inicio_sesion_dto_js_1 = require("../dto/inicio-sesion.dto.js");
let AutenticacionControlador = class AutenticacionControlador {
    registrarUsuario;
    iniciarSesion;
    constructor(registrarUsuario, iniciarSesion) {
        this.registrarUsuario = registrarUsuario;
        this.iniciarSesion = iniciarSesion;
    }
    async registro(dto) {
        return this.registrarUsuario.ejecutar(dto);
    }
    async login(dto) {
        return this.iniciarSesion.ejecutar(dto);
    }
};
exports.AutenticacionControlador = AutenticacionControlador;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registro_usuario_dto_js_1.RegistroUsuarioDto]),
    __metadata("design:returntype", Promise)
], AutenticacionControlador.prototype, "registro", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inicio_sesion_dto_js_1.InicioSesionDto]),
    __metadata("design:returntype", Promise)
], AutenticacionControlador.prototype, "login", null);
exports.AutenticacionControlador = AutenticacionControlador = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [registrar_usuario_caso_uso_js_1.RegistrarUsuarioCasoUso,
        iniciar_sesion_caso_uso_js_1.IniciarSesionCasoUso])
], AutenticacionControlador);
//# sourceMappingURL=autenticacion.controlador.js.map