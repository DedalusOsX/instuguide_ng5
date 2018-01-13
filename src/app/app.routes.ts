import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { NetworkComponent } from './network/network.component';
import { CourseComponent } from './courses/course/course.component';
import { CourseCreateComponent } from './courses/course-create/course-create.component';
import { CourseStoreComponent } from './courses/course-store/course-store.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaticPagesComponent } from './staticPages/static.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { LoggedInGuard } from './auth/loggedIn.guard';
import { UnitsComponent } from './courses/units/units.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';

export const ROUTES: Routes = [
  {path: '', component: AuthComponent, canActivate: [LoggedInGuard]},
  {path: 'auth/activate', component: ActivateAccountComponent, canActivate: [LoggedInGuard]},

  {path: 'app', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'courses', component: CourseStoreComponent, canActivate: [AuthGuard]},
  {path: 'courses/info/:courseId', component: CourseInfoComponent, canActivate: [AuthGuard]},
  {path: 'courses/new', component: CourseCreateComponent, canActivate: [AuthGuard]},
  {path: 'courses/my/:courseId', component: CourseComponent, canActivate: [AuthGuard]},
  {path: 'courses/my/:courseId/units/:unitId', component: UnitsComponent, canActivate: [AuthGuard]},
  {path: 'network', component: NetworkComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/:profileId', component: ProfileComponent, canActivate: [AuthGuard]},
  {
    path: '404.html',
    component: StaticPagesComponent,
    // resolve: {
    // page: 'error'
    // }
  },

  {path: '**', redirectTo: '/app'}
];
