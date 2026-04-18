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
exports.ConfiguracionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const usuario_entity_1 = require("../entities/usuario.entity");
let ConfiguracionService = class ConfiguracionService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find({ select: ['id', 'nombre', 'username', 'rol', 'activo', 'created_at'] });
    }
    async create(dto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const u = this.repo.create({ ...dto, password: hashed });
        const saved = await this.repo.save(u);
        const { password, ...rest } = saved;
        return rest;
    }
    async update(id, dto) {
        if (dto.password)
            dto.password = await bcrypt.hash(dto.password, 10);
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id }, select: ['id', 'nombre', 'username', 'rol', 'activo'] });
    }
    async remove(id) {
        const u = await this.repo.findOne({ where: { id } });
        if (!u)
            throw new common_1.NotFoundException();
        return this.repo.remove(u);
    }
};
exports.ConfiguracionService = ConfiguracionService;
exports.ConfiguracionService = ConfiguracionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfiguracionService);
//# sourceMappingURL=configuracion.service.js.map