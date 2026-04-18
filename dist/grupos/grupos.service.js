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
exports.GruposService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
const visita_entity_1 = require("../entities/visita.entity");
const vecino_entity_1 = require("../entities/vecino.entity");
let GruposService = class GruposService {
    constructor(grupoRepo, visitaRepo, vecinoRepo) {
        this.grupoRepo = grupoRepo;
        this.visitaRepo = visitaRepo;
        this.vecinoRepo = vecinoRepo;
    }
    async findAll(query) {
        const { fecha, tecnico, estado } = query;
        const qb = this.grupoRepo.createQueryBuilder('g')
            .leftJoinAndSelect('g.visitas', 'v')
            .leftJoinAndSelect('v.vecino', 'vec');
        if (fecha)
            qb.andWhere('g.fecha = :fecha', { fecha });
        if (tecnico)
            qb.andWhere('g.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
        if (estado)
            qb.andWhere('g.estado = :estado', { estado });
        qb.orderBy('g.fecha', 'DESC').addOrderBy('g.created_at', 'DESC');
        return qb.getMany();
    }
    async findHoy() {
        const hoy = new Date().toISOString().split('T')[0];
        return this.grupoRepo.find({
            where: { fecha: hoy },
            relations: ['visitas', 'visitas.vecino'],
            order: { created_at: 'ASC' },
        });
    }
    async findOne(id) {
        const g = await this.grupoRepo.findOne({
            where: { id },
            relations: ['visitas', 'visitas.vecino', 'visitas.vecino.camaras'],
        });
        if (!g)
            throw new common_1.NotFoundException('Grupo no encontrado');
        return g;
    }
    async create(dto) {
        const grupo = this.grupoRepo.create({
            nombre: dto.nombre,
            tecnico: dto.tecnico,
            fecha: dto.fecha,
            sector: dto.sector,
            observaciones: dto.observaciones,
        });
        const savedGrupo = await this.grupoRepo.save(grupo);
        for (const item of dto.vecino_ids) {
            const visita = this.visitaRepo.create({
                vecino_id: item.id,
                grupo_id: savedGrupo.id,
                orden: item.orden,
                fecha_programada: dto.fecha,
                tecnico: dto.tecnico,
                estado: visita_entity_1.EstadoVisita.PROGRAMADA,
            });
            await this.visitaRepo.save(visita);
        }
        return this.findOne(savedGrupo.id);
    }
    async update(id, dto) {
        await this.grupoRepo.update(id, dto);
        return this.findOne(id);
    }
    async updateVecinoEstado(grupoId, vecinoId, estado, observaciones, resultado) {
        const visita = await this.visitaRepo.findOne({ where: { grupo_id: grupoId, vecino_id: vecinoId } });
        if (!visita)
            throw new common_1.NotFoundException('Visita no encontrada en el grupo');
        visita.estado = estado;
        if (observaciones)
            visita.observaciones = observaciones;
        if (resultado)
            visita.resultado = resultado;
        return this.visitaRepo.save(visita);
    }
    async agregarVecinos(id, vecino_ids) {
        const grupo = await this.findOne(id);
        const maxOrden = grupo.visitas?.reduce((max, v) => Math.max(max, v.orden || 0), 0) || 0;
        for (let i = 0; i < vecino_ids.length; i++) {
            const item = vecino_ids[i];
            const yaExiste = grupo.visitas?.some(v => v.vecino_id === item.id);
            if (yaExiste)
                continue;
            const visita = this.visitaRepo.create({
                vecino_id: item.id,
                grupo_id: grupo.id,
                orden: item.orden ?? maxOrden + i + 1,
                fecha_programada: grupo.fecha,
                tecnico: grupo.tecnico,
                estado: visita_entity_1.EstadoVisita.PROGRAMADA,
            });
            await this.visitaRepo.save(visita);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const g = await this.findOne(id);
        return this.grupoRepo.remove(g);
    }
};
exports.GruposService = GruposService;
exports.GruposService = GruposService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grupo_visita_entity_1.GrupoVisita)),
    __param(1, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __param(2, (0, typeorm_1.InjectRepository)(vecino_entity_1.Vecino)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GruposService);
//# sourceMappingURL=grupos.service.js.map