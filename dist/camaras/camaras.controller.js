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
exports.CamarasController = void 0;
const common_1 = require("@nestjs/common");
const camaras_service_1 = require("./camaras.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CamarasController = class CamarasController {
    constructor(svc) {
        this.svc = svc;
    }
    findByVecino(id) {
        return this.svc.findByVecino(id);
    }
    create(id, dto) {
        return this.svc.create(id, dto);
    }
    update(id, dto) {
        return this.svc.update(id, dto);
    }
    remove(id) {
        return this.svc.remove(id);
    }
};
exports.CamarasController = CamarasController;
__decorate([
    (0, common_1.Get)('vecinos/:id/camaras'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CamarasController.prototype, "findByVecino", null);
__decorate([
    (0, common_1.Post)('vecinos/:id/camaras'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CamarasController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('camaras/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CamarasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('camaras/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CamarasController.prototype, "remove", null);
exports.CamarasController = CamarasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [camaras_service_1.CamarasService])
], CamarasController);
//# sourceMappingURL=camaras.controller.js.map