import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from 'src/profiles/auth.middleware';
import { BlogController } from './blog.controller';
import Blog from './blog.entity';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from 'src/profiles/profiles.module';
// import { ProfilesService } from 'src/profiles/profiles.service';


@Module({
  imports:[TypeOrmModule.forFeature([Blog]), ProfilesModule],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule implements NestModule {
  public configure(consumer: MiddlewareConsumer){
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'blog/all', method: RequestMethod.ALL},      
        {path: 'blog', method: RequestMethod.POST},      
        {path: 'blog/:id', method: RequestMethod.DELETE},      
        {path: 'blog/:id', method: RequestMethod.PUT},      
        
      )
  }
}
