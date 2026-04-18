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
exports.GrupoVisita = exports.EstadoGrupo = void 0;
const typeorm_1 = require("typeorm");
const visita_entity_1 = require("./visita.entity");
var EstadoGrupo;
(function (EstadoGrupo) {
    EstadoGrupo["PENDIENTE"] = "PENDIENTE";
    EstadoGrupo["EN_CURSO"] = "EN_CURSO";
    EstadoGrupo["COMPLETADO"] = "COMPLETADO";
})(EstadoGrupo || (exports.EstadoGrupo = EstadoGrupo = {}));
let GrupoVisita = class GrupoVisita {
};
exports.GrupoVisita = GrupoVisita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GrupoVisita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GrupoVisita.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GrupoVisita.prototype, "tecnico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], GrupoVisita.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GrupoVisita.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoGrupo, default: EstadoGrupo.PENDIENTE }),
    __metadata("design:type", String)
], GrupoVisita.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GrupoVisita.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visita_entity_1.Visita, (v) => v.grupo),
    __metadata("design:type", Array)
], GrupoVisita.prototype, "visitas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GrupoVisita.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GrupoVisita.prototype, "updated_at", void 0);
exports.GrupoVisita = GrupoVisita = __decorate([
    (0, typeorm_1.Entity)('grupos_visita')
], GrupoVisita);
//# sourceMappingURL=grupo-visita.entity.js.map