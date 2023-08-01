import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, Subject, throwError} from "rxjs";
import {User} from "./user.model";

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
  user = new BehaviorSubject<User>(null);

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
    ).pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuthentication(
          respData.email,
          respData.localId,
          respData.idToken,
          +respData.expiresIn);
      })
    );
  }

  login(email: string, password: string) {
    let apiKey = 'AIzaSyA-kE4rkyfvIovf7nxjpwX45TYMYrK0NlE';
    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuthentication(
          respData.email,
          respData.localId,
          respData.idToken,
          +respData.expiresIn);
      })
    );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate);
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage: string = 'An unknown errror occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage)
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exists';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
        break;
    }
    return throwError(errorMessage);
  }
}
