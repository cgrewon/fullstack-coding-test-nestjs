import { Controller, Get, Post, ValidationPipe, UsePipes, Body, Param, Put, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';

import { CreateProfileDto } from './dto/CreateProfileDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { ProfilesService } from './profiles.service';

import * as fireAdmin from 'firebase-admin'
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { Roles } from './roles.decorator';
import { Role } from 'src/enum/role.enum';
import { SignupDto } from './dto/SignupDto';


@Controller('profiles')
export class ProfilesController {

    constructor(
        private readonly profileService: ProfilesService
    ){
        
    }
    

    @Post('login/:uid')
    async login(@Param('uid') uid : string){        
        return await this.profileService.login(uid)
    }

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signup(@Body() signupDto : SignupDto, @Res({ passthrough: true }) res: Response){
        console.log('signup calling')
        const result = await this.profileService.signup(signupDto)
        if(result.status){
            res.status(result.status);            
        }
        return result
    }


    @Get(':id')
    @UseGuards(FirebaseAuthGuard)
    async getProfile (@Param('id') id: number){
        return await this.profileService.findById(id);        
    }

    @Get()
    async getAllProfiles(){
        return await this.profileService.findAll();
    }

    @Get('fuid/:uid')
    async getProfileByUid(
        @Param('uid') uid: string
    ){
        return await this.profileService.findOne(uid)
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @UseGuards(FirebaseAuthGuard)    
    async create(@Body() createProfileDto: CreateProfileDto){
        return await this.profileService.create(createProfileDto);
    }


    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateById(
        @Param('id') id:number, 
        @Body() updateProfileDto: UpdateProfileDto
    ){
        
        return await this.profileService.updateById(id, updateProfileDto);
    }

    @Put('fuid/:uid')
    @UsePipes(new ValidationPipe())
    async updateByUId(
        @Param('uid') uid:string, 
        @Body() updateProfileDto: UpdateProfileDto
    ){
        
        return await this.profileService.updateByUID(uid, updateProfileDto);
    }
  
}
