import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
// import { SECRET } from '../config';

import { ProfilesService } from 'src/profiles/profiles.service';
import { FirebaseAuthStrategy } from '../firebase/firebase-auth.strategy';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  
  constructor(private readonly profileService: ProfilesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      
      const firebaseAuthStrategy = new FirebaseAuthStrategy();
      const fbUser = await firebaseAuthStrategy.validate(token);

      const profile = await this.profileService.findOne(fbUser.uid);
      
      if (!profile || profile.status) {
        throw new HttpException('User profile not found.', HttpStatus.UNAUTHORIZED);
      }

      (req as any).profile = profile.profile;
      next();

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
