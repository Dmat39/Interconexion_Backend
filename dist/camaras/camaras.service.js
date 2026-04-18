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
exports.CamarasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
let CamarasService = class CamarasService {
    constructor(repo) {
        this.repo = repo;
    }
    findByVecino(vecinoId) {
        return this.repo.find({ where: { vecino_id: vecinoId }, order: { numero_camara: 'ASC' } });
    }
    async create(vecinoId, dto) {
        const camara = this.repo.create({ ...dto, vecino_id: vecinoId });
        return this.repo.save(camara);
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }
    async remove(id) {
        const c = await this.repo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException();
        return this.repo.remove(c);
    }
};
exports.CamarasService = CamarasService;
exports.CamarasService = CamarasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(camara_vecino_entity_1.CamaraVecino)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CamarasService);
//# sourceMappingURL=camaras.service.js.map