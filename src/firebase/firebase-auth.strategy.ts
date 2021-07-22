import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebaseConfig from './firebase.config.json';
import * as firebase from 'firebase-admin';
import Firebase from './firebase.client';

export const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
};

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    if(firebase.apps.length == 0){

      this.defaultApp = firebase.initializeApp({
        credential: firebase.credential.cert(firebase_params),
      });
    }else{
      this.defaultApp = firebase.app()
    }
    
  }
  async validate(token: string) {

    try{
      const userCredential = await Firebase.auth().signInWithCustomToken(token)

      if (!userCredential || !userCredential.user) {
        
        throw new UnauthorizedException();
      }
      return userCredential.user;
    }catch(ex){
      console.log(ex)
      throw new UnauthorizedException();
    }
    
  }

  async createUser(email: string, pwd: string){

    try{
        const user : any = await this.defaultApp
        .auth()
        .createUser({
            email,
            password: pwd,
            emailVerified: false,
            disabled: false            
        })
        console.log('user: ', user)
        const token = await this.createCustomToken(user.uid)
        return {user, token};
    }catch(err){
        console.log(err)
        return err;
    }
      
  }

  async createCustomToken(uid: string){
    const token = await this.defaultApp.auth().createCustomToken(uid)
    return token;
  }

  
}