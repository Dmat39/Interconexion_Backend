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
exports.Recuperacion = void 0;
const typeorm_1 = require("typeorm");
const vecino_entity_1 = require("./vecino.entity");
let Recuperacion = class Recuperacion {
};
exports.Recuperacion = Recuperacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Recuperacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vecino_entity_1.Vecino, (v) => v.recuperaciones, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'vecino_id' }),
    __metadata("design:type", vecino_entity_1.Vecino)
], Recuperacion.prototype, "vecino", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Recuperacion.prototype, "vecino_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Recuperacion.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Recuperacion.prototype, "fecha_recuperacion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Recuperacion.prototype, "tecnico", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Recuperacion.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Recuperacion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Recuperacion.prototype, "updated_at", void 0);
exports.Recuperacion = Recuperacion = __decorate([
    (0, typeorm_1.Entity)('recuperaciones')
], Recuperacion);
//# sourceMappingURL=recuperacion.entity.js.map