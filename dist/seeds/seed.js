"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const usuario_entity_1 = require("../entities/usuario.entity");
const vecino_entity_1 = require("../entities/vecino.entity");
const camara_vecino_entity_1 = require("../entities/camara-vecino.entity");
const grupo_visita_entity_1 = require("../entities/grupo-visita.entity");
const visita_entity_1 = require("../entities/visita.entity");
const recuperacion_entity_1 = require("../entities/recuperacion.entity");
const ds = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'sivi_db',
    entities: [usuario_entity_1.Usuario, vecino_entity_1.Vecino, camara_vecino_entity_1.CamaraVecino, grupo_visita_entity_1.GrupoVisita, visita_entity_1.Visita, recuperacion_entity_1.Recuperacion],
    synchronize: true,
});
async function seed() {
    await ds.initialize();
    const repo = ds.getRepository(usuario_entity_1.Usuario);
    const usuarios = [
        { nombre: 'Administrador', username: 'admin', password: 'admin123', rol: usuario_entity_1.RolUsuario.ADMIN },
        { nombre: 'Huaqui', username: 'huaqui', password: 'cecom2024', rol: usuario_entity_1.RolUsuario.TECNICO },
        { nombre: 'Vilchez', username: 'vilchez', password: 'cecom2024', rol: usuario_entity_1.RolUsuario.TECNICO },
    ];
    for (const u of usuarios) {
        const exists = await repo.findOne({ where: { username: u.username } });
        if (!exists) {
            const hashed = await bcrypt.hash(u.password, 10);
            await repo.save(repo.create({ ...u, password: hashed }));
            console.log(`✓ Usuario creado: ${u.username}`);
        }
        else {
            console.log(`- Usuario ya existe: ${u.username}`);
        }
    }
    await ds.destroy();
    console.log('\nSeed completado.');
}
seed().catch(console.error);
//# sourceMappingURL=seed.js.map