import { Controller, Get, Param } from '@nestjs/common';

@Controller('app')
export class AppController {


    @Get()
    index() {
        return "Hello! full stack coding test backend working with firebase.";
    }


    @Get('/:any')
    test(
        @Param('any') any: string
    ) {
        return "";
    }




}
