import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogin, UserSignup } from './auth.model';
import { AuthService } from './auth.service';
import { NotifierService } from '../shared/services/notifier.service';

@Component({
  selector: 'auth',
  templateUrl: 'auth.component.html',
})

export class AuthComponent implements OnInit {

  public userFormLogin: UserLogin;
  public userFormSignup: UserSignup;
  public formSubmitted: boolean;
  public signUp: boolean = false;
  public error: any;
  public busy: boolean = false;
  public view: any = {
    mode: 'login'
  };
  public languages = [{
    code: 'en',
    label: 'English'
  }, {
    code: 'hy',
    label: 'Armenian'
  }, {
    code: 'ru',
    label: 'Russian'
  }];

  @ViewChild('loginForm') public loginForm: NgForm;
  @ViewChild('signupForm') public signupForm: NgForm;

  constructor(private authService: AuthService, private route: ActivatedRoute,
    private router: Router, private notifierService: NotifierService) {
  }

  public ngOnInit() {
    // this.route.queryParams
    //   .subscribe(params => {
    //     this.signUp = params['view'] === 'signup';
    //   });

    this._setDefault();
  }

  public tryToLogin(e): boolean {
    this.busy = true;
    e.preventDefault();
    this.formSubmitted = true;
    this.authService.login(this.userFormLogin)
      .subscribe(() => {
        this.busy = false;
        this._setDefault();
      },
      error => {
        this.busy = false;
        this.error = error;
      });
    return false;
  }

  public tryToSignup(e): boolean {
    e.preventDefault();
    if (!this.signupForm.form.valid) {
      this.error = {
        errors: [
          { message: 'Please complete all required fields' }
        ]
      };
      return false;
    }

    this.busy = true;
    this.formSubmitted = true;

    this.authService.signup(this.userFormSignup)
      .subscribe((response) => {
        this.busy = false;
        this.notifierService.showSuccess('Please check your email for activate your account');
        this.view.mode = 'login';
        this._setDefault();
      },
      error => {
        this.busy = false;
        this.error = error;
      });

    return false;
  }

  public toggleForm(): void {
    this._setDefault();
  }

  private _setDefault(): void {
    this.error = null;
    this.formSubmitted = false;

    this.userFormLogin = new UserLogin();
    this.userFormSignup = new UserSignup();
  }
}
