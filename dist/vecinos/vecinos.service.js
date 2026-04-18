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
exports.VecinosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
let VecinosService = class VecinosService {
    constructor(repo, camaraRepo) {
        this.repo = repo;
        this.camaraRepo = camaraRepo;
    }
    async findAll(query) {
        const { estado, sector, gestor, buscar, page = 1, limit = 20 } = query;
        const p = Number(page), l = Number(limit);
        const qb = this.repo.createQueryBuilder('v');
        if (estado)
            qb.andWhere('v.estado = :estado', { estado });
        if (sector)
            qb.andWhere('v.sector = :sector', { sector });
        if (gestor)
            qb.andWhere('v.nombre_gestor ILIKE :gestor', { gestor: `%${gestor}%` });
        if (buscar) {
            qb.andWhere('(v.nombre ILIKE :buscar OR v.direccion ILIKE :buscar OR v.celular ILIKE :buscar)', { buscar: `%${buscar}%` });
        }
        const total = await qb.getCount();
        const data = await qb
            .orderBy('v.created_at', 'DESC')
            .skip((p - 1) * l)
            .take(l)
            .getMany();
        if (data.length > 0) {
            const ids = data.map(v => v.id);
            const camaras = await this.camaraRepo.find({ where: { vecino_id: (0, typeorm_2.In)(ids) } });
            const camaraMap = new Map();
            for (const c of camaras) {
                if (!camaraMap.has(c.vecino_id))
                    camaraMap.set(c.vecino_id, []);
                camaraMap.get(c.vecino_id).push(c);
            }
            for (const v of data)
                v.camaras = camaraMap.get(v.id) || [];
        }
        return { data, total, page: p, limit: l, pages: Math.ceil(total / l) };
    }
    async findOne(id) {
        const v = await this.repo.findOne({
            where: { id },
            relations: ['camaras', 'visitas', 'visitas.grupo'],
        });
        if (!v)
            throw new common_1.NotFoundException('Vecino no encontrado');
        return v;
    }
    async create(dto) {
        const vecino = this.repo.create(dto);
        return this.repo.save(vecino);
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const v = await this.findOne(id);
        return this.repo.remove(v);
    }
    async getSectores() {
        const result = await this.repo
            .createQueryBuilder('v')
            .select('DISTINCT v.sector', 'sector')
            .where('v.sector IS NOT NULL')
            .getRawMany();
        return result.map((r) => r.sector).filter(Boolean);
    }
};
exports.VecinosService = VecinosService;
exports.VecinosService = VecinosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vecino_entity_1.Vecino)),
    __param(1, (0, typeorm_1.InjectRepository)(camara_vecino_entity_1.CamaraVecino)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VecinosService);
//# sourceMappingURL=vecinos.service.js.map