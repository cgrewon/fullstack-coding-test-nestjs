import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './CreateProfileDto';


export class UpdateProfileDto extends PartialType(CreateProfileDto){}