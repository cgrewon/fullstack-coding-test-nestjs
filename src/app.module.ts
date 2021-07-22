import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';
import { BlogModule } from './blog/blog.module';
import { RolesGuard } from './profiles/roles.guard';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ProfilesModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '123456',
    //   database: 'fullstack_test',
    //   entities: ["/src/**/*.entity.{ts,js}"],
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-44-194-68-175.compute-1.amazonaws.com',
      port: 5432,
      username: 'phjwoiuxvjridl',
      password: 'd1e74245466da4cb4cff0ed6fe2b8585e5add16957a2c3cd1cbea8e9ff9c8a56',
      database: 'd1j6usuupilads',
      entities: ["/src/**/*.entity.{ts,js}"],
      synchronize: true,
      autoLoadEntities: true,
    }),
    BlogModule,

  ],
  controllers: [],
  providers: [
    AppService,
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule { }

