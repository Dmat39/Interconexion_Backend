import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VecinosModule } from './vecinos/vecinos.module';
import { CamarasModule } from './camaras/camaras.module';
import { GruposModule } from './grupos/grupos.module';
import { VisitasModule } from './visitas/visitas.module';
import { RecuperacionesModule } from './recuperaciones/recuperaciones.module';
import { ImportModule } from './import/import.module';
import { MapaModule } from './mapa/mapa.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { ReportesModule } from './reportes/reportes.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { Usuario } from './entities/usuario.entity';
import { Vecino } from './entities/vecino.entity';
import { CamaraVecino } from './entities/camara-vecino.entity';
import { GrupoVisita } from './entities/grupo-visita.entity';
import { Visita } from './entities/visita.entity';
import { Recuperacion } from './entities/recuperacion.entity';
import { UrbanizacionesModule } from './urbanizaciones/urbanizaciones.module';
import { ActivasModule } from './activas/activas.module';
import { Urbanizacion } from './entities/urbanizacion.entity';
import { VecinalActiva } from './entities/vecinal-activa.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'sivi_db',
      entities: [Usuario, Vecino, CamaraVecino, GrupoVisita, Visita, Recuperacion, Urbanizacion, VecinalActiva],
      synchronize: true,
    }),
    AuthModule,
    VecinosModule,
    CamarasModule,
    GruposModule,
    VisitasModule,
    RecuperacionesModule,
    ImportModule,
    MapaModule,
    EstadisticasModule,
    ReportesModule,
    ConfiguracionModule,
    UrbanizacionesModule,
    ActivasModule,
  ],
})
export class AppModule {}
