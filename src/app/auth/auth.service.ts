import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  signUp(email: string, password: string) {
    let apiKey = 'AIzaSyA-kE4rkyfvIovf7nxjpwX45TYMYrK0NlE';
    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError( errorResponse => {
      let errorMessage:string = 'An unknown errror occurred!';
      if(!errorResponse.error || !errorResponse.error.error){
        return throwError(errorMessage)
      }
      switch (errorResponse.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists';
      }
      return throwError(errorMessage);
    }));
  }

  login(email: string, password: string) {
    let apiKey = 'AIzaSyA-kE4rkyfvIovf7nxjpwX45TYMYrK0NlE';
    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      });
  }
}