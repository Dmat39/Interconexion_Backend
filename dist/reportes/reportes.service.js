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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExcelJS = require("exceljs");
const visita_entity_1 = require("../entities/visita.entity");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
let ReportesService = class ReportesService {
    constructor(visitaRepo, grupoRepo) {
        this.visitaRepo = visitaRepo;
        this.grupoRepo = grupoRepo;
    }
    async getVisitasDia(fecha, tecnico) {
        const qb = this.visitaRepo.createQueryBuilder('v')
            .leftJoinAndSelect('v.vecino', 'vec')
            .leftJoinAndSelect('v.grupo', 'g')
            .where('v.fecha_programada = :fecha', { fecha });
        if (tecnico)
            qb.andWhere('v.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
        qb.orderBy('g.nombre', 'ASC').addOrderBy('v.orden', 'ASC');
        const visitas = await qb.getMany();
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Visitas del Día');
        ws.columns = [
            { header: 'N°', key: 'n', width: 5 },
            { header: 'Grupo', key: 'grupo', width: 25 },
            { header: 'Nombre Vecino', key: 'nombre', width: 30 },
            { header: 'Dirección', key: 'direccion', width: 35 },
            { header: 'Celular', key: 'celular', width: 15 },
            { header: 'Sector', key: 'sector', width: 20 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: 'Observaciones', key: 'observaciones', width: 30 },
        ];
        ws.getRow(1).font = { bold: true };
        visitas.forEach((v, i) => {
            ws.addRow({
                n: i + 1,
                grupo: v.grupo?.nombre || 'Individual',
                nombre: v.vecino?.nombre,
                direccion: v.vecino?.direccion,
                celular: v.vecino?.celular,
                sector: v.vecino?.sector,
                estado: v.estado,
                observaciones: v.observaciones,
            });
        });
        return wb.xlsx.writeBuffer();
    }
    async getRutaGrupo(grupoId) {
        const visitas = await this.visitaRepo.find({
            where: { grupo_id: grupoId },
            relations: ['vecino'],
            order: { orden: 'ASC' },
        });
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Ruta del Grupo');
        ws.columns = [
            { header: 'N°', key: 'n', width: 5 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Dirección', key: 'direccion', width: 35 },
            { header: 'Celular', key: 'celular', width: 15 },
            { header: 'Lat', key: 'lat', width: 15 },
            { header: 'Lng', key: 'lng', width: 15 },
            { header: 'Estado', key: 'estado', width: 15 },
        ];
        ws.getRow(1).font = { bold: true };
        visitas.forEach((v, i) => {
            ws.addRow({
                n: i + 1,
                nombre: v.vecino?.nombre,
                direccion: v.vecino?.direccion,
                celular: v.vecino?.celular,
                lat: v.vecino?.lat,
                lng: v.vecino?.lng,
                estado: v.estado,
            });
        });
        return wb.xlsx.writeBuffer();
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __param(1, (0, typeorm_1.InjectRepository)(grupo_visita_entity_1.GrupoVisita)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map