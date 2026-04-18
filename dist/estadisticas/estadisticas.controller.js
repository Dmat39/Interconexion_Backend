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
exports.EstadisticasController = void 0;
const common_1 = require("@nestjs/common");
const estadisticas_service_1 = require("./estadisticas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EstadisticasController = class EstadisticasController {
    constructor(svc) {
        this.svc = svc;
    }
    getResumen() { return this.svc.getResumen(); }
};
exports.EstadisticasController = EstadisticasController;
__decorate([
    (0, common_1.Get)('resumen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EstadisticasController.prototype, "getResumen", null);
exports.EstadisticasController = EstadisticasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('estadisticas'),
    __metadata("design:paramtypes", [estadisticas_service_1.EstadisticasService])
], EstadisticasController);
//# sourceMappingURL=estadisticas.controller.js.map