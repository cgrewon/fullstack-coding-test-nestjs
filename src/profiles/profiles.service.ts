import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { CreateProfileDto } from './dto/CreateProfileDto';
import Profile from './profiles.entity';
import { validate } from 'class-validator';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { SignupDto } from './dto/SignupDto';
import { FirebaseAuthStrategy } from 'src/firebase/firebase-auth.strategy';



@Injectable()
export class ProfilesService {
    
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>
    ){ }

    async findAll(){
        const profiles = await (await this.profileRepository.find()).sort((a: Profile,b: Profile)=>a.id < b.id ? -1 : 1);
        return {profiles: profiles}
    }

    async findOne(uid: string){
        
        const profile = await this.profileRepository.findOne({uid: uid})

        if(!profile){
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "There is no profile with this UID #" + uid
            }
        }

        return {profile};

    }

    async findByName(name: string){
      
        const profile = await this.profileRepository.findOne({name: name})

        if(!profile){
            return {
                statud: HttpStatus.BAD_REQUEST,
                message: `There is no profile with name: ${name} ` 
            }
        }

        return {profile};
    }

    async findById(id: number){
        
        const profile = await this.profileRepository.findOne({id: id})

        if(!profile){
            return {
                statud: HttpStatus.BAD_REQUEST,
                message: `There is no profile with id: #${id} ` 
            }
        }

        return {profile};
    }

    async login(uid: string){
        const firebaseAuthStrategy = new FirebaseAuthStrategy();

        const token = await firebaseAuthStrategy.createCustomToken(uid)

        const profile = await this.findOne(uid)

        return {
            token,
            profile
        }

    }

    async signup(signupDto: SignupDto){
        
        const firebaseAuthStrategy = new FirebaseAuthStrategy();
        const {
            email, name, pwd, dob
        } = signupDto;

        const {user, token, message} = await firebaseAuthStrategy.createUser(email, pwd);
        
        if(message){
            return {
                status: HttpStatus.BAD_REQUEST,
                message
            }
        }
        if(user.uid){
            const profile = await this.create({
                name: name,
                dob: new Date(dob),
                uid: user.uid
            })


            return {
                token,
                ...profile
            }
        }else{
            return {
                status: HttpStatus.BAD_REQUEST,
                message: user.message
              }
        }

    }

    async create(createProfileDto: CreateProfileDto) {

        const {name, dob, uid} = createProfileDto;

        const existProfile = await this.profileRepository.findOne({name: name})


        // if(existProfile){
        //     return {
        //         status : HttpStatus.BAD_REQUEST,
        //         message: "Name must be unique."
        //     }
        // }

        let newProfile = new Profile();
        newProfile.name = name;
        newProfile.dob = dob;
        newProfile.uid = uid;

        const errors = await validate(newProfile);
        

        if (errors.length > 0) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: errors
            }
        } else {
            const savedProfile = await this.profileRepository.save(newProfile);
            return { profile: savedProfile };
        }
        
    }


    async updateById(id:number, updateProfileDto : UpdateProfileDto){
        const profile = await this.profileRepository.findOne({id: id})
        if (!profile) {
            return {
              status: HttpStatus.BAD_REQUEST,
              message: 'There is not profile with this id.'
            }
        }

        await this.profileRepository.update(id, updateProfileDto);

        const updatedProfile = await this.profileRepository.findOne({id: id})

        return {
            profile: updatedProfile
        };

    }


    async updateByUID(uid:string, updateProfileDto : UpdateProfileDto){
        const profile = await this.profileRepository.findOne({uid: uid})
        if (!profile) {
            return {
              status: HttpStatus.BAD_REQUEST,
              message: 'There is not profile with this id.'
            }
        }

        await this.profileRepository.update(profile.id, updateProfileDto);

        const updatedProfile = await this.profileRepository.findOne({id: profile.id})

        return {
            profile: updatedProfile
        };

    }


    async remove(id: number) {
        const profile = await this.profileRepository.findOne({ id: id });
        if (!profile) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'There is not profile.'
          }
        }
        await this.profileRepository.delete({ id: id });
        return this.findAll();
    }



    
}
