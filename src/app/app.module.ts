import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';

import { Ng2PaginationModule } from 'ng2-pagination';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnouncementComponent } from './dashboard/announcement/announcement.component';
import { ProfileComponent } from './profile/profile.component';
import { NetworkComponent } from './network/network.component';
import { CourseComponent } from './courses/course/course.component';
import { CourseCreateComponent } from './courses/course-create/course-create.component';
import { CourseStoreComponent } from './courses/course-store/course-store.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';
import { UnitsComponent } from './courses/units/units.component';
import { ObjectiveComponent } from './courses/units/materials/objectives/objectives.component';
import { LessonComponent } from './courses/units/materials/lessons/lessons.component';
import { AssignmentComponent } from './courses/units/materials/assignments/assignments.component';
import { PracticeComponent } from './courses/units/materials/practice/practice.component';
import { StaticPagesComponent } from './staticPages/static.component';

import { NgPipesModule } from 'ngx-pipes';

import { appRouting } from './app.routing';

import { UserService } from './services/user.service';
import { CoursesService } from './courses/courses.service';
import { AnswerService } from './services/answer.service';
import { UnitsService } from './courses/units.service';
import { GradesService } from './services/grades.service';
import { SettingsService } from './services/settings.service';
import { environment } from '../environments/environment';
// Application wide providers

import 'assets/styles/index.scss';
import { MaterialsService } from './courses/units/materials/materials.service';

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstrapping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NetworkComponent,
    DashboardComponent,
    AnnouncementComponent,
    CourseComponent,
    CourseStoreComponent,
    CourseInfoComponent,
    CourseCreateComponent,
    ProfileComponent,
    ObjectiveComponent,
    LessonComponent,
    UnitsComponent,
    AssignmentComponent,
    PracticeComponent,
    StaticPagesComponent,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AuthModule,
    Ng2PaginationModule,
    NgPipesModule,
    SharedModule,
    // CountUpModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS,
    CoursesService,
    UserService,
    MaterialsService,
    UnitsService,
    GradesService,
    AnswerService,
    SettingsService
  ]
})
export class AppModule {

  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
