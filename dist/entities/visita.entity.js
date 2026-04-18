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
exports.Visita = exports.EstadoVisita = void 0;
const typeorm_1 = require("typeorm");
const vecino_entity_1 = require("./vecino.entity");
const grupo_visita_entity_1 = require("./grupo-visita.entity");
var EstadoVisita;
(function (EstadoVisita) {
    EstadoVisita["PROGRAMADA"] = "PROGRAMADA";
    EstadoVisita["COMPLETADA"] = "COMPLETADA";
    EstadoVisita["NO_ATENDIDO"] = "NO_ATENDIDO";
    EstadoVisita["REPROGRAMAR"] = "REPROGRAMAR";
})(EstadoVisita || (exports.EstadoVisita = EstadoVisita = {}));
let Visita = class Visita {
};
exports.Visita = Visita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Visita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vecino_entity_1.Vecino, (v) => v.visitas, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'vecino_id' }),
    __metadata("design:type", vecino_entity_1.Vecino)
], Visita.prototype, "vecino", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visita.prototype, "vecino_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grupo_visita_entity_1.GrupoVisita, (g) => g.visitas, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'grupo_id' }),
    __metadata("design:type", grupo_visita_entity_1.GrupoVisita)
], Visita.prototype, "grupo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "grupo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Visita.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Visita.prototype, "fecha_programada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "hora_programada", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visita.prototype, "tecnico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoVisita, default: EstadoVisita.PROGRAMADA }),
    __metadata("design:type", String)
], Visita.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "resultado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Visita.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Visita.prototype, "updated_at", void 0);
exports.Visita = Visita = __decorate([
    (0, typeorm_1.Entity)('visitas')
], Visita);
//# sourceMappingURL=visita.entity.js.map