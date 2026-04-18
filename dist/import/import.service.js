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
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const XLSX = require("xlsx");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
const recuperacion_entity_1 = require("../entities/recuperacion.entity");
const visita_entity_1 = require("../entities/visita.entity");
const SECTORES_H2 = ['MANGOMARCA', 'CANTO GRANDE', 'GANIMEDES', 'CANTO BELLO', 'LOS JARDINES', 'LAS FLORES'];
const SECTORES_H3 = ['CANTO BELLO', 'GANIMEDES', 'CANTO GRANDE'];
let ImportService = class ImportService {
    constructor(vecinoRepo, camaraRepo, recuperacionRepo, visitaRepo) {
        this.vecinoRepo = vecinoRepo;
        this.camaraRepo = camaraRepo;
        this.recuperacionRepo = recuperacionRepo;
        this.visitaRepo = visitaRepo;
    }
    parseCoord(val) {
        if (val === null || val === undefined || val === '')
            return null;
        const n = parseFloat(String(val).trim().replace(',', '.'));
        return isNaN(n) ? null : n;
    }
    parseLatLng(val) {
        if (!val)
            return null;
        const str = String(val).trim();
        const parts = str.split(',');
        if (parts.length >= 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng) &&
                lat !== 0 && lng !== 0 &&
                Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
                return { lat, lng };
            }
        }
        return null;
    }
    parseBoolean(val) {
        if (val === null || val === undefined)
            return null;
        const s = String(val).toLowerCase().trim();
        if (['si', 'sí', 'yes', '1', 'true'].includes(s))
            return true;
        if (['no', '0', 'false'].includes(s))
            return false;
        return null;
    }
    parseDate(val) {
        if (!val)
            return null;
        if (typeof val === 'number') {
            try {
                const date = XLSX.SSF.parse_date_code(val);
                if (date) {
                    const y = date.y < 100 ? date.y + 2000 : date.y;
                    return `${y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
                }
            }
            catch {
                return null;
            }
        }
        const s = String(val).trim();
        if (!s)
            return null;
        const parts = s.split('/');
        if (parts.length === 3) {
            let [a, b, c] = parts;
            let year = parseInt(c);
            if (year < 100)
                year += 2000;
            const numA = parseInt(a), numB = parseInt(b);
            let day, month;
            if (numB > 12) {
                month = numA;
                day = numB;
            }
            else {
                day = numA;
                month = numB;
            }
            if (month < 1 || month > 12 || day < 1 || day > 31)
                return null;
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        return null;
    }
    isHeaderRow(row) {
        const col1 = String(row[1] || '').trim().toLowerCase();
        const col0 = String(row[0] || '').trim().toLowerCase();
        return col1 === 'nombre' || col0 === 'marca temporal';
    }
    isSectorRow(row, sectores) {
        const col0 = String(row[0] || '').trim().toUpperCase();
        const nonNullCols = row.filter(c => c !== null && c !== undefined && String(c).trim() !== '');
        if (nonNullCols.length <= 3 && col0) {
            const found = sectores.find(s => col0.includes(s));
            return found || null;
        }
        return null;
    }
    async upsertVecino(nombre, direccion, data, dryRun, sobreescribir = true) {
        const existing = await this.vecinoRepo.findOne({
            where: { nombre: nombre?.trim(), direccion: direccion?.trim() },
        });
        if (existing) {
            if (!dryRun && sobreescribir) {
                Object.assign(existing, data);
                await this.vecinoRepo.save(existing);
            }
            return { vecino: existing, isNew: false };
        }
        const vecino = this.vecinoRepo.create({ nombre: nombre?.trim(), direccion: direccion?.trim(), ...data });
        if (!dryRun)
            await this.vecinoRepo.save(vecino);
        return { vecino, isNew: true };
    }
    buildVecinoFromRow(row) {
        const coords = this.parseLatLng(row[4]);
        const estadoRaw = String(row[6] || '').trim().toUpperCase();
        let estado = vecino_entity_1.EstadoVecino.PENDIENTE;
        if (estadoRaw === 'CITA')
            estado = vecino_entity_1.EstadoVecino.CITA;
        else if (estadoRaw === 'INTERCONEXIÓN' || estadoRaw === 'INTERCONEXION')
            estado = vecino_entity_1.EstadoVecino.INTERCONEXION;
        else if (estadoRaw === 'CANCELADO')
            estado = vecino_entity_1.EstadoVecino.CANCELADO;
        return {
            celular: String(row[2] || '').trim() || null,
            lat: coords?.lat || null,
            lng: coords?.lng || null,
            nombre_gestor: String(row[5] || '').trim() || null,
            estado,
            fecha_tentativa: this.parseDate(row[7]),
            tiene_internet: this.parseBoolean(row[8]),
            visualiza_camaras_celular: this.parseBoolean(row[9]),
            aplicativo: String(row[10] || '').trim() || null,
            herramientas_extra: String(row[11] || '').trim() || null,
            marca: String(row[12] || '').trim() || null,
            tipo_camara: String(row[13] || '').trim() || null,
            nombre_grabador: String(row[14] || '').trim() || null,
            contrasena: String(row[15] || '').trim() || null,
            num_camaras: parseInt(row[16]) || null,
            mes: String(row[154] || '').trim() || null,
            fecha_registro: this.parseDate(row[155]),
        };
    }
    async processCamaras(vecino, row, result, dryRun) {
        const numCams = parseInt(row[16]) || 0;
        if (numCams <= 0)
            return;
        const sectionStart = {
            1: 17, 2: 18, 3: 20, 4: 23, 5: 27,
            6: 32, 7: 38, 8: 45, 9: 53, 10: 62,
            11: 72, 12: 83, 13: 95, 14: 108, 15: 122, 16: 137,
        };
        const startCol = sectionStart[numCams];
        if (!startCol)
            return;
        for (let i = 0; i < numCams; i++) {
            const col = startCol + i;
            if (col >= row.length)
                break;
            const coords = this.parseLatLng(row[col]);
            if (!coords)
                continue;
            if (!dryRun) {
                await this.camaraRepo.delete({ vecino_id: vecino.id, numero_camara: i + 1 });
                await this.camaraRepo.save(this.camaraRepo.create({
                    vecino_id: vecino.id, numero_camara: i + 1, lat: coords.lat, lng: coords.lng,
                }));
            }
            result.camaras_importadas++;
        }
    }
    async importExcel(buffer, dryRun = false) {
        const result = {
            vecinos_importados: 0,
            vecinos_actualizados: 0,
            camaras_importadas: 0,
            recuperaciones_importadas: 0,
            visitas_importadas: 0,
            errores: [],
        };
        const wb = XLSX.read(buffer, { type: 'buffer' });
        try {
            const ws1 = wb.Sheets[wb.SheetNames[0]];
            const rows1 = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: null });
            for (let i = 1; i < rows1.length; i++) {
                const row = rows1[i];
                if (this.isHeaderRow(row))
                    continue;
                const nombre = String(row[1] || '').trim();
                const direccion = String(row[3] || '').trim();
                if (!nombre || !direccion)
                    continue;
                try {
                    const data = this.buildVecinoFromRow(row);
                    const { vecino, isNew } = await this.upsertVecino(nombre, direccion, data, dryRun);
                    if (isNew)
                        result.vecinos_importados++;
                    else
                        result.vecinos_actualizados++;
                    if (vecino.id)
                        await this.processCamaras(vecino, row, result, dryRun);
                }
                catch (e) {
                    result.errores.push(`Hoja 1, fila ${i + 1}: ${e.message}`);
                }
            }
        }
        catch (e) {
            result.errores.push(`Error procesando Hoja 1: ${e.message}`);
        }
        try {
            const ws2 = wb.Sheets[wb.SheetNames[1]];
            const rows2 = XLSX.utils.sheet_to_json(ws2, { header: 1, defval: null });
            let sectorActual = '';
            for (let i = 0; i < rows2.length; i++) {
                const row = rows2[i];
                if (this.isHeaderRow(row))
                    continue;
                const sector = this.isSectorRow(row, SECTORES_H2);
                if (sector) {
                    sectorActual = sector;
                    continue;
                }
                const nombre = String(row[1] || '').trim();
                const direccion = String(row[3] || '').trim();
                if (!nombre || !direccion)
                    continue;
                try {
                    const data = this.buildVecinoFromRow(row);
                    data.sector = sectorActual || data.sector;
                    const { vecino, isNew } = await this.upsertVecino(nombre, direccion, data, dryRun, false);
                    if (isNew)
                        result.vecinos_importados++;
                    else
                        result.vecinos_actualizados++;
                    if (!dryRun && sectorActual && vecino.id) {
                        await this.recuperacionRepo.save(this.recuperacionRepo.create({
                            vecino_id: vecino.id,
                            sector: sectorActual,
                            fecha_recuperacion: new Date().toISOString().split('T')[0],
                            tecnico: data.nombre_gestor || 'Importado',
                        }));
                    }
                    result.recuperaciones_importadas++;
                }
                catch (e) {
                    result.errores.push(`Hoja 2, fila ${i + 1}: ${e.message}`);
                }
            }
        }
        catch (e) {
            result.errores.push(`Error procesando Hoja 2: ${e.message}`);
        }
        try {
            const ws3 = wb.Sheets[wb.SheetNames[2]];
            const rows3 = XLSX.utils.sheet_to_json(ws3, { header: 1, defval: null });
            let sectorActual = '';
            for (let i = 3; i < rows3.length; i++) {
                const row = rows3[i];
                if (this.isHeaderRow(row))
                    continue;
                const sector = this.isSectorRow(row, SECTORES_H3);
                if (sector) {
                    sectorActual = sector;
                    continue;
                }
                const nombre = String(row[1] || '').trim();
                const direccion = String(row[3] || '').trim();
                if (!nombre || !direccion)
                    continue;
                try {
                    const data = this.buildVecinoFromRow(row);
                    data.sector = sectorActual || data.sector;
                    const { vecino, isNew } = await this.upsertVecino(nombre, direccion, data, dryRun, false);
                    if (isNew)
                        result.vecinos_importados++;
                    else
                        result.vecinos_actualizados++;
                    if (!dryRun && vecino.id) {
                        await this.visitaRepo.save(this.visitaRepo.create({
                            vecino_id: vecino.id,
                            fecha_programada: data.fecha_tentativa || new Date().toISOString().split('T')[0],
                            tecnico: data.nombre_gestor || 'Importado',
                            estado: visita_entity_1.EstadoVisita.PROGRAMADA,
                        }));
                    }
                    result.visitas_importadas++;
                }
                catch (e) {
                    result.errores.push(`Hoja 3, fila ${i + 1}: ${e.message}`);
                }
            }
        }
        catch (e) {
            result.errores.push(`Error procesando Hoja 3: ${e.message}`);
        }
        return result;
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vecino_entity_1.Vecino)),
    __param(1, (0, typeorm_1.InjectRepository)(camara_vecino_entity_1.CamaraVecino)),
    __param(2, (0, typeorm_1.InjectRepository)(recuperacion_entity_1.Recuperacion)),
    __param(3, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ImportService);
//# sourceMappingURL=import.service.js.map