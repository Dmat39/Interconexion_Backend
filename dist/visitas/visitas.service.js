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
exports.VisitasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const visita_entity_1 = require("../entities/visita.entity");
let VisitasService = class VisitasService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(query) {
        const { fecha, tecnico, estado, grupoId } = query;
        const qb = this.repo.createQueryBuilder('v')
            .leftJoinAndSelect('v.vecino', 'vec')
            .leftJoinAndSelect('v.grupo', 'g');
        if (fecha)
            qb.andWhere('v.fecha_programada = :fecha', { fecha });
        if (tecnico)
            qb.andWhere('v.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
        if (estado)
            qb.andWhere('v.estado = :estado', { estado });
        if (grupoId)
            qb.andWhere('v.grupo_id = :grupoId', { grupoId });
        qb.orderBy('v.fecha_programada', 'DESC').addOrderBy('v.orden', 'ASC');
        return qb.getMany();
    }
    async getCalendario(inicio, fin) {
        return this.repo.find({
            where: { fecha_programada: (0, typeorm_2.Between)(inicio, fin) },
            relations: ['vecino', 'grupo'],
            order: { fecha_programada: 'ASC' },
        });
    }
    async create(dto) {
        const v = this.repo.create(dto);
        return this.repo.save(v);
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id }, relations: ['vecino', 'grupo'] });
    }
    async reprogramar(id, nuevaFecha, observaciones) {
        const original = await this.repo.findOne({ where: { id } });
        if (!original)
            throw new common_1.NotFoundException();
        original.estado = visita_entity_1.EstadoVisita.REPROGRAMAR;
        if (observaciones)
            original.observaciones = observaciones;
        await this.repo.save(original);
        const nueva = this.repo.create({
            vecino_id: original.vecino_id,
            tecnico: original.tecnico,
            fecha_programada: nuevaFecha,
            estado: visita_entity_1.EstadoVisita.PROGRAMADA,
            observaciones: `Reprogramada desde visita del ${original.fecha_programada}`,
        });
        return this.repo.save(nueva);
    }
};
exports.VisitasService = VisitasService;
exports.VisitasService = VisitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VisitasService);
//# sourceMappingURL=visitas.service.js.map