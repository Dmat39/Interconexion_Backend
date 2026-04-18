"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const vecinos_module_1 = require("./vecinos/vecinos.module");
const camaras_module_1 = require("./camaras/camaras.module");
const grupos_module_1 = require("./grupos/grupos.module");
const visitas_module_1 = require("./visitas/visitas.module");
const recuperaciones_module_1 = require("./recuperaciones/recuperaciones.module");
const import_module_1 = require("./import/import.module");
const mapa_module_1 = require("./mapa/mapa.module");
const estadisticas_module_1 = require("./estadisticas/estadisticas.module");
const reportes_module_1 = require("./reportes/reportes.module");
const configuracion_module_1 = require("./configuracion/configuracion.module");
const usuario_entity_1 = require("./entities/usuario.entity");
const vecino_entity_1 = require("./entities/vecino.entity");
const camara_vecino_entity_1 = require("./entities/camara-vecino.entity");
const grupo_visita_entity_1 = require("./entities/grupo-visita.entity");
const visita_entity_1 = require("./entities/visita.entity");
const recuperacion_entity_1 = require("./entities/recuperacion.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASS || 'postgres',
                database: process.env.DB_NAME || 'sivi_db',
                entities: [usuario_entity_1.Usuario, vecino_entity_1.Vecino, camara_vecino_entity_1.CamaraVecino, grupo_visita_entity_1.GrupoVisita, visita_entity_1.Visita, recuperacion_entity_1.Recuperacion],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            vecinos_module_1.VecinosModule,
            camaras_module_1.CamarasModule,
            grupos_module_1.GruposModule,
            visitas_module_1.VisitasModule,
            recuperaciones_module_1.RecuperacionesModule,
            import_module_1.ImportModule,
            mapa_module_1.MapaModule,
            estadisticas_module_1.EstadisticasModule,
            reportes_module_1.ReportesModule,
            configuracion_module_1.ConfiguracionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map