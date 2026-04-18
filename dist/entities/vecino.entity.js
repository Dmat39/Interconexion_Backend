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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vecino = exports.EstadoVecino = void 0;
const typeorm_1 = require("typeorm");
const camara_vecino_entity_1 = require("./camara-vecino.entity");
const visita_entity_1 = require("./visita.entity");
const recuperacion_entity_1 = require("./recuperacion.entity");
var EstadoVecino;
(function (EstadoVecino) {
    EstadoVecino["CITA"] = "CITA";
    EstadoVecino["INTERCONEXION"] = "INTERCONEXI\u00D3N";
    EstadoVecino["PENDIENTE"] = "PENDIENTE";
    EstadoVecino["CANCELADO"] = "CANCELADO";
})(EstadoVecino || (exports.EstadoVecino = EstadoVecino = {}));
let Vecino = class Vecino {
};
exports.Vecino = Vecino;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vecino.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vecino.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "celular", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Vecino.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Vecino.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "nombre_gestor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoVecino, default: EstadoVecino.PENDIENTE }),
    __metadata("design:type", String)
], Vecino.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "fecha_tentativa", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Vecino.prototype, "tiene_internet", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Vecino.prototype, "visualiza_camaras_celular", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "aplicativo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "herramientas_extra", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "tipo_camara", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "nombre_grabador", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "contrasena", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Vecino.prototype, "num_camaras", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "mes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Vecino.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => camara_vecino_entity_1.CamaraVecino, (c) => c.vecino),
    __metadata("design:type", Array)
], Vecino.prototype, "camaras", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visita_entity_1.Visita, (v) => v.vecino),
    __metadata("design:type", Array)
], Vecino.prototype, "visitas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => recuperacion_entity_1.Recuperacion, (r) => r.vecino),
    __metadata("design:type", Array)
], Vecino.prototype, "recuperaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vecino.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Vecino.prototype, "updated_at", void 0);
exports.Vecino = Vecino = __decorate([
    (0, typeorm_1.Entity)('vecinos')
], Vecino);
//# sourceMappingURL=vecino.entity.js.map