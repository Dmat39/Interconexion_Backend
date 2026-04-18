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
exports.MapaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
const visita_entity_1 = require("../entities/visita.entity");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
let MapaService = class MapaService {
    constructor(vecinoRepo, camaraRepo, visitaRepo, grupoRepo) {
        this.vecinoRepo = vecinoRepo;
        this.camaraRepo = camaraRepo;
        this.visitaRepo = visitaRepo;
        this.grupoRepo = grupoRepo;
    }
    async getVecinos() {
        return this.vecinoRepo.createQueryBuilder('v')
            .select(['v.id', 'v.nombre', 'v.direccion', 'v.lat', 'v.lng', 'v.estado', 'v.sector', 'v.num_camaras', 'v.nombre_gestor'])
            .where('v.lat IS NOT NULL AND v.lng IS NOT NULL')
            .getMany();
    }
    async getCamaras() {
        const camaras = await this.camaraRepo.find({ relations: ['vecino'] });
        return camaras
            .filter(c => c.lat && c.lng)
            .map(c => ({
            id: c.id,
            vecino_id: c.vecino_id,
            numero_camara: c.numero_camara,
            lat: Number(c.lat),
            lng: Number(c.lng),
            vecino_nombre: c.vecino?.nombre || '',
        }));
    }
    async getGrupos() {
        return this.grupoRepo.find({
            select: ['id', 'nombre', 'fecha', 'tecnico', 'sector', 'estado'],
            order: { fecha: 'DESC', created_at: 'DESC' },
        });
    }
    async getRutaGrupo(id) {
        const visitas = await this.visitaRepo.find({
            where: { grupo_id: id },
            relations: ['vecino'],
            order: { orden: 'ASC' },
        });
        const grupo = await this.grupoRepo.findOne({ where: { id } });
        return {
            grupo,
            paradas: visitas
                .filter(v => v.vecino?.lat && v.vecino?.lng)
                .map((v, idx) => ({
                orden: v.orden ?? idx + 1,
                estado: v.estado,
                vecino: {
                    id: v.vecino.id,
                    nombre: v.vecino.nombre,
                    direccion: v.vecino.direccion,
                    lat: Number(v.vecino.lat),
                    lng: Number(v.vecino.lng),
                    celular: v.vecino.celular,
                    num_camaras: v.vecino.num_camaras,
                    estado: v.vecino.estado,
                },
            })),
        };
    }
};
exports.MapaService = MapaService;
exports.MapaService = MapaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vecino_entity_1.Vecino)),
    __param(1, (0, typeorm_1.InjectRepository)(camara_vecino_entity_1.CamaraVecino)),
    __param(2, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __param(3, (0, typeorm_1.InjectRepository)(grupo_visita_entity_1.GrupoVisita)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MapaService);
//# sourceMappingURL=mapa.service.js.map