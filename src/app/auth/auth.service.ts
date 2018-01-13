import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Request, RequestMethod, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { tokenNotExpired } from 'angular2-jwt';
import { UserLogin, UserSignup } from './auth.model';
import { UserService } from '../services/user.service';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';
import { environment } from '../../environments/environment';

export const ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student'
};

@Injectable()
export class AuthService {
  public token: string = '';

  private rootUrl = 'auth';

  constructor(private router: Router, private http: Http, private errorCatcher: ErrorCatcherService, private userService: UserService) {
    this.token = localStorage.getItem(environment.tokenKey);
  }

  public login(userForm: UserLogin): Observable<{}> {
    return this.http.post(this.rootUrl + '/login', userForm)
      .map((response: Response) => {
        let result = this._extractData(response);
        this._storeTokens(result);
        this.userService.getCurrentUser();
        this.router.navigate(['/app']);
        return result;
      })
      .catch(err => this.errorCatcher.handleRequestError(err));
  };

  public signup(userForm: UserSignup) {
    let request = new Request({
      method: RequestMethod.Post,
      url: this.rootUrl + '/signup',
      body: userForm
    });

    return this.http.request(request)
      .catch(err => this.errorCatcher.handleRequestError(err));
  };

  public updatePassword(material: any) {
    let url = this.rootUrl + '/change-password';
    return this.http.put(url, material)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public activate(activationParams: any) {
    return this.http.post(this.rootUrl + '/activate', activationParams)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public loggedIn(): boolean {
    return tokenNotExpired();
  };

  public logout(): void {
    this.token = null;
    this.userService.clearSession();
    localStorage.removeItem(environment.tokenKey);
    this.router.navigate(['/']);
  };

  private _storeTokens(result: any) {
    let token = result.data.token;
    if (token) {
      this.token = token;
      localStorage.setItem(environment.tokenKey, token);
    }
  }

  private _extractData(res: Response): any {
    return res.json() || {};
  }
}
