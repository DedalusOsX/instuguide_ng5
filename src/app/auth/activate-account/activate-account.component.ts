import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'activate-account',
  templateUrl: 'activate-account.component.html'
})

export class ActivateAccountComponent {

  public error: any = null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe(values => {
      if (!values.activation_code || !values.email) {
        return router.navigate(['404.html']);
      }
      this.checkActivation(values);
    });
  }

  public checkActivation(params) {
    this.authService.activate(params)
      .subscribe(response => {
        this.router.navigate(['login']);
      }, (error) => {
        this.error = error;
        setTimeout(() => {
          this.router.navigate(['/app']);
        }, 5000);
      });
  }
}
