import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

import { Usuario, RolUsuario } from '../entities/usuario.entity';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Visita } from '../entities/visita.entity';
import { Recuperacion } from '../entities/recuperacion.entity';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'sivi_db',
  entities: [Usuario, Vecino, CamaraVecino, GrupoVisita, Visita, Recuperacion],
  synchronize: true,
});

async function seed() {
  await ds.initialize();
  const repo = ds.getRepository(Usuario);

  const usuarios = [
    { nombre: 'Administrador', username: 'admin', password: 'admin123', rol: RolUsuario.ADMIN },
    { nombre: 'Huaqui', username: 'huaqui', password: 'cecom2024', rol: RolUsuario.TECNICO },
    { nombre: 'Vilchez', username: 'vilchez', password: 'cecom2024', rol: RolUsuario.TECNICO },
  ];

  for (const u of usuarios) {
    const exists = await repo.findOne({ where: { username: u.username } });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await repo.save(repo.create({ ...u, password: hashed }));
      console.log(`✓ Usuario creado: ${u.username}`);
    } else {
      console.log(`- Usuario ya existe: ${u.username}`);
    }
  }

  await ds.destroy();
  console.log('\nSeed completado.');
}

seed().catch(console.error);
