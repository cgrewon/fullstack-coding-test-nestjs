import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/profiles/auth.middleware';
import { ProfilesController } from './profiles.controller';
import Profile from './profiles.entity';
import { ProfilesService } from './profiles.service';

@Module({
  imports:[TypeOrmModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService]
})
export class ProfilesModule {}
// implements NestModule {
//   public configure(consumer: MiddlewareConsumer){
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes(
//         {path: 'profiles/:id', method: RequestMethod.GET},      
//       )
//   }
// }
