
import { Controller, Get, Post, ValidationPipe, UsePipes, Body, Param, Put, UseGuards, Delete, Res } from '@nestjs/common';
import { CreateBlogDto } from './dto/CreateBlogDto';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import { BlogService } from './blog.service';
import { Response } from 'express';

import * as fireAdmin from 'firebase-admin'
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { Roles } from 'src/profiles/roles.decorator';
import { Role } from 'src/enum/role.enum';



@Controller('blog')
export class BlogController {

    constructor(
        private readonly blogService: BlogService
    ){}

    @Get('detail/:id')    
    @Roles(Role.Admin, Role.User)
    async getBlog (@Param('id') id: number){
        return await this.blogService.findById(id);        
    }


    @Get('all')
    @Roles(Role.Admin, Role.User)
    async getAllBlogs(){
        return await this.blogService.findAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @Roles(Role.Admin)
    async create(@Body() createBlogDto: CreateBlogDto, @Res({ passthrough: true }) res: Response){

        const result = await this.blogService.create(createBlogDto);
        if(result.status){
            res.status(result.status);
        }
        return result;
    }
    
    
    @Put(':id')
    @UsePipes(new ValidationPipe())
    @Roles(Role.Admin)
    async updateById(
        @Param('id') id:number, 
        @Body() updateBlogDto: UpdateBlogDto
    ){
        
        return await this.blogService.updateById(id, updateBlogDto);
    }


    @Delete(':id')
    @Roles(Role.Admin)
    async remove(
        @Param('id') id:number,
    ){
        return await this.blogService.remove(id)
    }

}
