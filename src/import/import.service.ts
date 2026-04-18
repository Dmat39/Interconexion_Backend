import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Vecino, EstadoVecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Recuperacion } from '../entities/recuperacion.entity';
import { Visita, EstadoVisita } from '../entities/visita.entity';

export interface ImportResult {
  vecinos_importados: number;
  vecinos_actualizados: number;
  camaras_importadas: number;
  recuperaciones_importadas: number;
  visitas_importadas: number;
  errores: string[];
}

/*
 * Estructura real del Excel (verificado con el archivo):
 * Col 0:  Marca temporal
 * Col 1:  Nombre
 * Col 2:  Celular
 * Col 3:  Dirección
 * Col 4:  Latitud y Longitud (general, string "lat,lng")
 * Col 5:  Nombre del gestor
 * Col 6:  ESTADO
 * Col 7:  Fecha tentativa
 * Col 8:  ¿Cuánta con internet?
 * Col 9:  ¿Visualiza sus cámaras en el celular?
 * Col 10: ¿Qué aplicativo maneja?
 * Col 11: ¿Qué herramientas extra necesita?
 * Col 12: Marca
 * Col 13: Tipo de cámara
 * Col 14: Nombre del Grabador
 * Col 15: Contraseña
 * Col 16: Número de cámaras
 * Col 17: Latitud y Longitud (Una cámara)      ← cámara 1 como "lat,lng"
 * Col 18: Latitud y Longitud (Dos cámara) lat  ← cámara 2 lat
 * Col 19: Latitud y Longitud (Dos cámara) lng  ← cámara 2 lng
 * Col 20: Tres cámaras lat
 * Col 21: Tres cámaras (extra)
 * Col 22: Tres cámaras lng
 * ... (patrón continúa)
 */

const SECTORES_H2 = ['MANGOMARCA', 'CANTO GRANDE', 'GANIMEDES', 'CANTO BELLO', 'LOS JARDINES', 'LAS FLORES'];
const SECTORES_H3 = ['CANTO BELLO', 'GANIMEDES', 'CANTO GRANDE'];

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Vecino) private vecinoRepo: Repository<Vecino>,
    @InjectRepository(CamaraVecino) private camaraRepo: Repository<CamaraVecino>,
    @InjectRepository(Recuperacion) private recuperacionRepo: Repository<Recuperacion>,
    @InjectRepository(Visita) private visitaRepo: Repository<Visita>,
  ) {}

  private parseCoord(val: any): number | null {
    if (val === null || val === undefined || val === '') return null;
    const n = parseFloat(String(val).trim().replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  private parseLatLng(val: any): { lat: number; lng: number } | null {
    if (!val) return null;
    const str = String(val).trim();
    const parts = str.split(',');
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      // Valida rangos geográficos válidos para evitar overflow en decimal(10,7)
      if (!isNaN(lat) && !isNaN(lng) &&
          lat !== 0 && lng !== 0 &&
          Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return { lat, lng };
      }
    }
    return null;
  }

  private parseBoolean(val: any): boolean | null {
    if (val === null || val === undefined) return null;
    const s = String(val).toLowerCase().trim();
    if (['si', 'sí', 'yes', '1', 'true'].includes(s)) return true;
    if (['no', '0', 'false'].includes(s)) return false;
    return null;
  }

  private parseDate(val: any): string | null {
    if (!val) return null;
    // Excel guarda fechas como número serial
    if (typeof val === 'number') {
      try {
        const date = XLSX.SSF.parse_date_code(val);
        if (date) {
          const y = date.y < 100 ? date.y + 2000 : date.y;
          return `${y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        }
      } catch { return null; }
    }
    const s = String(val).trim();
    if (!s) return null;
    const parts = s.split('/');
    if (parts.length === 3) {
      let [a, b, c] = parts;
      let year = parseInt(c);
      // Corrige año de 2 dígitos o siglo incorrecto (ej. 0024 → 2024)
      if (year < 100) year += 2000;
      const numA = parseInt(a), numB = parseInt(b);
      let day: number, month: number;
      // Si b > 12, el formato es MM/DD (estilo americano)
      if (numB > 12) { month = numA; day = numB; }
      else { day = numA; month = numB; }
      if (month < 1 || month > 12 || day < 1 || day > 31) return null;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return null;
  }

  private isHeaderRow(row: any[]): boolean {
    const col1 = String(row[1] || '').trim().toLowerCase();
    const col0 = String(row[0] || '').trim().toLowerCase();
    return col1 === 'nombre' || col0 === 'marca temporal';
  }

  private isSectorRow(row: any[], sectores: string[]): string | null {
    const col0 = String(row[0] || '').trim().toUpperCase();
    // Es fila de sector si col 0 tiene texto y el resto está vacío/casi vacío
    const nonNullCols = row.filter(c => c !== null && c !== undefined && String(c).trim() !== '');
    if (nonNullCols.length <= 3 && col0) {
      const found = sectores.find(s => col0.includes(s));
      return found || null;
    }
    return null;
  }

  private async upsertVecino(
    nombre: string,
    direccion: string,
    data: Partial<Vecino>,
    dryRun: boolean,
    sobreescribir = true,   // false → si ya existe, no toca sus datos (solo devuelve el existente)
  ): Promise<{ vecino: Vecino; isNew: boolean }> {
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
    if (!dryRun) await this.vecinoRepo.save(vecino);
    return { vecino, isNew: true };
  }

  private buildVecinoFromRow(row: any[]): Partial<Vecino> {
    const coords = this.parseLatLng(row[4]);

    // Col 6 = ESTADO (verificado con el Excel real)
    const estadoRaw = String(row[6] || '').trim().toUpperCase();
    let estado = EstadoVecino.PENDIENTE;
    if (estadoRaw === 'CITA') estado = EstadoVecino.CITA;
    else if (estadoRaw === 'INTERCONEXIÓN' || estadoRaw === 'INTERCONEXION') estado = EstadoVecino.INTERCONEXION;
    else if (estadoRaw === 'CANCELADO') estado = EstadoVecino.CANCELADO;

    return {
      celular: String(row[2] || '').trim() || null,
      lat: coords?.lat || null,
      lng: coords?.lng || null,
      nombre_gestor: String(row[5] || '').trim() || null,
      estado,
      fecha_tentativa: this.parseDate(row[7]),           // Col 7
      tiene_internet: this.parseBoolean(row[8]),          // Col 8
      visualiza_camaras_celular: this.parseBoolean(row[9]), // Col 9
      aplicativo: String(row[10] || '').trim() || null,  // Col 10
      herramientas_extra: String(row[11] || '').trim() || null, // Col 11
      marca: String(row[12] || '').trim() || null,        // Col 12
      tipo_camara: String(row[13] || '').trim() || null,  // Col 13
      nombre_grabador: String(row[14] || '').trim() || null, // Col 14
      contrasena: String(row[15] || '').trim() || null,   // Col 15
      num_camaras: parseInt(row[16]) || null,              // Col 16
      mes: String(row[154] || '').trim() || null,          // Col 154
      fecha_registro: this.parseDate(row[155]),             // Col 155
      // Cols 17-152 son coordenadas de cámaras (procesadas en processCamaras)
    };
  }

  private async processCamaras(vecino: Vecino, row: any[], result: ImportResult, dryRun: boolean) {
    const numCams = parseInt(row[16]) || 0;
    if (numCams <= 0) return;

    /*
     * Estructura real del Excel: para N cámaras existe una sección de N columnas consecutivas,
     * cada columna contiene "lat,lng" para una cámara.
     *   1 cám → col 17       (1 col)
     *   2 cám → cols 18-19   (2 cols)
     *   3 cám → cols 20-22   (3 cols)
     *   4 cám → cols 23-26   (4 cols)
     *   5 cám → cols 27-31   (5 cols)
     *   6 cám → cols 32-37   (6 cols)
     *   7 cám → cols 38-44   (7 cols)
     *   8 cám → cols 45-52   (8 cols)
     *   9 cám → cols 53-61   (9 cols)
     *  10 cám → cols 62-71  (10 cols)
     *  11 cám → cols 72-82  (11 cols)
     *  12 cám → cols 83-94  (12 cols)
     *  13 cám → cols 95-107 (13 cols)
     *  14 cám → cols 108-121(14 cols)
     *  15 cám → cols 122-136(15 cols)
     *  16 cám → cols 137-152(16 cols)
     */
    const sectionStart: Record<number, number> = {
      1: 17,  2: 18,  3: 20,  4: 23,  5: 27,
      6: 32,  7: 38,  8: 45,  9: 53, 10: 62,
      11: 72, 12: 83, 13: 95, 14: 108, 15: 122, 16: 137,
    };

    const startCol = sectionStart[numCams];
    if (!startCol) return;

    for (let i = 0; i < numCams; i++) {
      const col = startCol + i;
      if (col >= row.length) break;
      const coords = this.parseLatLng(row[col]);
      if (!coords) continue;
      if (!dryRun) {
        await this.camaraRepo.delete({ vecino_id: vecino.id, numero_camara: i + 1 });
        await this.camaraRepo.save(this.camaraRepo.create({
          vecino_id: vecino.id, numero_camara: i + 1, lat: coords.lat, lng: coords.lng,
        }));
      }
      result.camaras_importadas++;
    }
  }

  async importExcel(buffer: Buffer, dryRun = false): Promise<ImportResult> {
    const result: ImportResult = {
      vecinos_importados: 0,
      vecinos_actualizados: 0,
      camaras_importadas: 0,
      recuperaciones_importadas: 0,
      visitas_importadas: 0,
      errores: [],
    };

    const wb = XLSX.read(buffer, { type: 'buffer' });

    // ─── HOJA 1: Registro general ──────────────────────────────────────────
    try {
      const ws1 = wb.Sheets[wb.SheetNames[0]];
      const rows1: any[][] = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: null });
      // Fila 0 = headers, datos desde fila 1
      for (let i = 1; i < rows1.length; i++) {
        const row = rows1[i];
        if (this.isHeaderRow(row)) continue;
        const nombre = String(row[1] || '').trim();
        const direccion = String(row[3] || '').trim();
        if (!nombre || !direccion) continue;
        try {
          const data = this.buildVecinoFromRow(row);
          const { vecino, isNew } = await this.upsertVecino(nombre, direccion, data, dryRun);
          if (isNew) result.vecinos_importados++;
          else result.vecinos_actualizados++;
          if (vecino.id) await this.processCamaras(vecino, row, result, dryRun);
        } catch (e) {
          result.errores.push(`Hoja 1, fila ${i + 1}: ${e.message}`);
        }
      }
    } catch (e) {
      result.errores.push(`Error procesando Hoja 1: ${e.message}`);
    }

    // ─── HOJA 2: Recuperaciones ────────────────────────────────────────────
    try {
      const ws2 = wb.Sheets[wb.SheetNames[1]];
      const rows2: any[][] = XLSX.utils.sheet_to_json(ws2, { header: 1, defval: null });
      let sectorActual = '';

      for (let i = 0; i < rows2.length; i++) {
        const row = rows2[i];
        if (this.isHeaderRow(row)) continue;

        const sector = this.isSectorRow(row, SECTORES_H2);
        if (sector) { sectorActual = sector; continue; }

        const nombre = String(row[1] || '').trim();
        const direccion = String(row[3] || '').trim();
        if (!nombre || !direccion) continue;

        try {
          const data = this.buildVecinoFromRow(row);
          data.sector = sectorActual || data.sector;
          // sobreescribir=false: si el vecino ya viene de Hoja 1, no pisamos sus datos
          const { vecino, isNew } = await this.upsertVecino(nombre, direccion, data, dryRun, false);
          if (isNew) result.vecinos_importados++;
          else result.vecinos_actualizados++;
          if (!dryRun && sectorActual && vecino.id) {
            await this.recuperacionRepo.save(this.recuperacionRepo.create({
              vecino_id: vecino.id,
              sector: sectorActual,
              fecha_recuperacion: new Date().toISOString().split('T')[0],
              tecnico: data.nombre_gestor || 'Importado',
            }));
          }
          result.recuperaciones_importadas++;
        } catch (e) {
          result.errores.push(`Hoja 2, fila ${i + 1}: ${e.message}`);
        }
      }
    } catch (e) {
      result.errores.push(`Error procesando Hoja 2: ${e.message}`);
    }

    // ─── HOJA 3: Visitas programadas ───────────────────────────────────────
    try {
      const ws3 = wb.Sheets[wb.SheetNames[2]];
      const rows3: any[][] = XLSX.utils.sheet_to_json(ws3, { header: 1, defval: null });
      let sectorActual = '';
      // Fila 0: título, Fila 1: vacía, Fila 2: headers, datos desde fila 3
      for (let i = 3; i < rows3.length; i++) {
        const row = rows3[i];
        if (this.isHeaderRow(row)) continue;

        const sector = this.isSectorRow(row, SECTORES_H3);
        if (sector) { sectorActual = sector; continue; }

        const nombre = String(row[1] || '').trim();
        const direccion = String(row[3] || '').trim();
        if (!nombre || !direccion) continue;

        try {
          const data = this.buildVecinoFromRow(row);
          data.sector = sectorActual || data.sector;
          // sobreescribir=false: si el vecino ya viene de Hoja 1, no pisamos sus datos
          const { vecino, isNew } = await this.upsertVecino(nombre, direccion, data, dryRun, false);
          if (isNew) result.vecinos_importados++;
          else result.vecinos_actualizados++;
          if (!dryRun && vecino.id) {
            await this.visitaRepo.save(this.visitaRepo.create({
              vecino_id: vecino.id,
              fecha_programada: data.fecha_tentativa || new Date().toISOString().split('T')[0],
              tecnico: data.nombre_gestor || 'Importado',
              estado: EstadoVisita.PROGRAMADA,
            }));
          }
          result.visitas_importadas++;
        } catch (e) {
          result.errores.push(`Hoja 3, fila ${i + 1}: ${e.message}`);
        }
      }
    } catch (e) {
      result.errores.push(`Error procesando Hoja 3: ${e.message}`);
    }

    return result;
  }
}
