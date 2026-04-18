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
exports.EstadisticasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
const visita_entity_1 = require("../entities/visita.entity");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
const recuperacion_entity_1 = require("../entities/recuperacion.entity");
let EstadisticasService = class EstadisticasService {
    constructor(vecinoRepo, camaraRepo, visitaRepo, grupoRepo, recuperacionRepo) {
        this.vecinoRepo = vecinoRepo;
        this.camaraRepo = camaraRepo;
        this.visitaRepo = visitaRepo;
        this.grupoRepo = grupoRepo;
        this.recuperacionRepo = recuperacionRepo;
    }
    async getResumen() {
        const hoy = new Date().toISOString().split('T')[0];
        const [total_vecinos, total_camaras] = await Promise.all([
            this.vecinoRepo.count(),
            this.camaraRepo.count(),
        ]);
        const por_estado_raw = await this.vecinoRepo
            .createQueryBuilder('v')
            .select('v.estado', 'estado')
            .addSelect('COUNT(*)', 'total')
            .groupBy('v.estado')
            .getRawMany();
        const por_estado = { CITA: 0, 'INTERCONEXIÓN': 0, PENDIENTE: 0, CANCELADO: 0 };
        por_estado_raw.forEach((r) => { por_estado[r.estado] = parseInt(r.total); });
        const por_sector = await this.vecinoRepo
            .createQueryBuilder('v')
            .select('v.sector', 'sector')
            .addSelect('COUNT(*)', 'total')
            .where('v.sector IS NOT NULL')
            .groupBy('v.sector')
            .getRawMany();
        const recuperados_sector = await this.recuperacionRepo
            .createQueryBuilder('r')
            .select('r.sector', 'sector')
            .addSelect('COUNT(*)', 'total')
            .groupBy('r.sector')
            .getRawMany();
        const por_sector_merged = por_sector.map((s) => ({
            sector: s.sector,
            total: parseInt(s.total),
            recuperados: parseInt(recuperados_sector.find((r) => r.sector === s.sector)?.total || '0'),
        }));
        const por_tecnico = await this.visitaRepo
            .createQueryBuilder('v')
            .select('v.tecnico', 'tecnico')
            .addSelect('COUNT(*)', 'total_visitas')
            .addSelect("SUM(CASE WHEN v.estado = 'COMPLETADA' THEN 1 ELSE 0 END)", 'completadas')
            .groupBy('v.tecnico')
            .getRawMany();
        const [grupos_hoy, visitas_hoy] = await Promise.all([
            this.grupoRepo.count({ where: { fecha: hoy } }),
            this.visitaRepo.count({ where: { fecha_programada: hoy } }),
        ]);
        return {
            total_vecinos,
            total_camaras,
            por_estado,
            por_sector: por_sector_merged,
            por_tecnico: por_tecnico.map((t) => ({
                tecnico: t.tecnico,
                total_visitas: parseInt(t.total_visitas),
                completadas: parseInt(t.completadas),
            })),
            grupos_hoy,
            visitas_hoy,
        };
    }
};
exports.EstadisticasService = EstadisticasService;
exports.EstadisticasService = EstadisticasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vecino_entity_1.Vecino)),
    __param(1, (0, typeorm_1.InjectRepository)(camara_vecino_entity_1.CamaraVecino)),
    __param(2, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __param(3, (0, typeorm_1.InjectRepository)(grupo_visita_entity_1.GrupoVisita)),
    __param(4, (0, typeorm_1.InjectRepository)(recuperacion_entity_1.Recuperacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EstadisticasService);
//# sourceMappingURL=estadisticas.service.js.map