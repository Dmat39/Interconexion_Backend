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
exports.MapaController = void 0;
const common_1 = require("@nestjs/common");
const mapa_service_1 = require("./mapa.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MapaController = class MapaController {
    constructor(svc) {
        this.svc = svc;
    }
    getVecinos() { return this.svc.getVecinos(); }
    getCamaras() { return this.svc.getCamaras(); }
    getGrupos() { return this.svc.getGrupos(); }
    getRutaGrupo(id) { return this.svc.getRutaGrupo(id); }
};
exports.MapaController = MapaController;
__decorate([
    (0, common_1.Get)('vecinos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MapaController.prototype, "getVecinos", null);
__decorate([
    (0, common_1.Get)('camaras'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MapaController.prototype, "getCamaras", null);
__decorate([
    (0, common_1.Get)('grupos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MapaController.prototype, "getGrupos", null);
__decorate([
    (0, common_1.Get)('grupo/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MapaController.prototype, "getRutaGrupo", null);
exports.MapaController = MapaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('mapa'),
    __metadata("design:paramtypes", [mapa_service_1.MapaService])
], MapaController);
//# sourceMappingURL=mapa.controller.js.map