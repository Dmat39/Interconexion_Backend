"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadisticasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const estadisticas_controller_1 = require("./estadisticas.controller");
const estadisticas_service_1 = require("./estadisticas.service");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
const visita_entity_1 = require("../entities/visita.entity");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
const recuperacion_entity_1 = require("../entities/recuperacion.entity");
let EstadisticasModule = class EstadisticasModule {
};
exports.EstadisticasModule = EstadisticasModule;
exports.EstadisticasModule = EstadisticasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vecino_entity_1.Vecino, camara_vecino_entity_1.CamaraVecino, visita_entity_1.Visita, grupo_visita_entity_1.GrupoVisita, recuperacion_entity_1.Recuperacion])],
        controllers: [estadisticas_controller_1.EstadisticasController],
        providers: [estadisticas_service_1.EstadisticasService],
    })
], EstadisticasModule);
//# sourceMappingURL=estadisticas.module.js.map