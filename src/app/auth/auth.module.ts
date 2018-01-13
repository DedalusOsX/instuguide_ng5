import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { LoggedInGuard } from './loggedIn.guard';
import { AuthService } from './auth.service';

import { AuthComponent } from './auth.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    AuthComponent,
    ActivateAccountComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoggedInGuard
  ]
})
export class AuthModule {
}
