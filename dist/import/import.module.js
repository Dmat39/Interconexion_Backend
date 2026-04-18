"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const import_controller_1 = require("./import.controller");
const import_service_1 = require("./import.service");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
const recuperacion_entity_1 = require("../entities/recuperacion.entity");
const visita_entity_1 = require("../entities/visita.entity");
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([vecino_entity_1.Vecino, camara_vecino_entity_1.CamaraVecino, recuperacion_entity_1.Recuperacion, visita_entity_1.Visita]),
            platform_express_1.MulterModule.register({ dest: './uploads' }),
        ],
        controllers: [import_controller_1.ImportController],
        providers: [import_service_1.ImportService],
    })
], ImportModule);
//# sourceMappingURL=import.module.js.map