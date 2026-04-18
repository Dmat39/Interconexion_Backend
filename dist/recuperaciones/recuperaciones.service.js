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
exports.RecuperacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recuperacion_entity_1 = require("../entities/recuperacion.entity");
let RecuperacionesService = class RecuperacionesService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(query) {
        const { sector, tecnico, fecha } = query;
        const qb = this.repo.createQueryBuilder('r')
            .leftJoinAndSelect('r.vecino', 'v');
        if (sector)
            qb.andWhere('r.sector ILIKE :sector', { sector: `%${sector}%` });
        if (tecnico)
            qb.andWhere('r.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
        if (fecha)
            qb.andWhere('r.fecha_recuperacion = :fecha', { fecha });
        qb.orderBy('r.fecha_recuperacion', 'DESC');
        return qb.getMany();
    }
    async getPorSector() {
        return this.repo.createQueryBuilder('r')
            .select('r.sector', 'sector')
            .addSelect('COUNT(*)', 'total')
            .groupBy('r.sector')
            .orderBy('total', 'DESC')
            .getRawMany();
    }
    async create(dto) {
        const r = this.repo.create(dto);
        return this.repo.save(r);
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id }, relations: ['vecino'] });
    }
};
exports.RecuperacionesService = RecuperacionesService;
exports.RecuperacionesService = RecuperacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recuperacion_entity_1.Recuperacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RecuperacionesService);
//# sourceMappingURL=recuperaciones.service.js.map