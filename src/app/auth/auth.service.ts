import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  signUp(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-kE4rkyfvIovf7nxjpwX45TYMYrK0NlE',
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
}
