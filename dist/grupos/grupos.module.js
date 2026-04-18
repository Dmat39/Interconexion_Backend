"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GruposModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const grupos_controller_1 = require("./grupos.controller");
const grupos_service_1 = require("./grupos.service");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
const visita_entity_1 = require("../entities/visita.entity");
const vecino_entity_1 = require("../entities/vecino.entity");
let GruposModule = class GruposModule {
};
exports.GruposModule = GruposModule;
exports.GruposModule = GruposModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([grupo_visita_entity_1.GrupoVisita, visita_entity_1.Visita, vecino_entity_1.Vecino])],
        controllers: [grupos_controller_1.GruposController],
        providers: [grupos_service_1.GruposService],
        exports: [grupos_service_1.GruposService],
    })
], GruposModule);
//# sourceMappingURL=grupos.module.js.map