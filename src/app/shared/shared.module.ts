/**
 * Core modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/**
 * 3rd party modules and components
 */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartModule } from 'angular2-highcharts';
import { FileUploadModule } from 'ng2-file-upload';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { SidebarModule } from 'ng-sidebar';
// import { CountUpModule } from 'countup.js/countUp.module';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

/**
 * Custom Components
 */
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { TilesComponent } from './components/tiles/tiles.component';
// import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';
import { GradesComponent } from './components/grades/grades.component';
import { PieGradesComponent } from './components/grades/pie/pie-grades.component';
import { BusyLoaderComponent } from './components/busy-loader/busy-loader.component';
import { AlertComponent } from './components/alert/alert.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DocumentComponent } from './components/document/document.component';
import { InputComponent } from './components/form/input/input.component';
import { TextareaComponent } from './components/form/textarea/textarea.component';
import { DropdownComponent } from './components/form/dropdown/dropdown.component';
import { ListComponent } from './components/form/list/list.component';
import { SearchComponent } from './components/form/search/search.component';
import { TimepickerComponent } from './components/form/timepicker/timepicker.component';
import { DatepickerComponent } from './components/form/datepicker/datepicker.component';
import { FileUploaderComponent } from './components/form/uploaders/file/file-uploader.component';
import { ImageUploaderComponent } from './components/form/uploaders/image/image-uploader.component';
/**
 * Custom Directives/Pipes
 */
import { PipesModule } from './pipes/pipes.module';
import { IconPickerDirective } from './directives/icon-picker.directive';
import { NumberOnlyDirective } from './directives/only-number.directive';
import { LimitToDirective } from './directives/limit-to.directive';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { ErrorCatcherService } from './services/error-catcher.service';
import { HttpService } from './services/http-interceptor.service';
import { NotifierService } from './services/notifier.service';

/**
 * Custom Services
 */

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function httpServiceFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
  return new HttpService(backend, defaultOptions);
}

export function highchartsFactory() {
  let hc = require('highcharts/highstock');
  require('highcharts/highcharts-more')(hc);
  require('highcharts/modules/exporting')(hc);
  require('highcharts/modules/solid-gauge')(hc);
  return hc;
}

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    Ng2FilterPipeModule,
    FormsModule,
    RouterModule,
    FileUploadModule,
    HttpClientModule,
    ReactiveFormsModule,
    // CountUpModule,
    SidebarModule,
    ToastModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ChartModule
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    CalendarComponent,
    DocumentComponent,
    TilesComponent,
    GradesComponent,
    AlertComponent,
    BusyLoaderComponent,
    InputComponent,
    SearchComponent,
    TextareaComponent,
    DropdownComponent,
    TimepickerComponent,
    ListComponent,
    FileUploaderComponent,
    ImageUploaderComponent,
    DatepickerComponent,
    PieGradesComponent,
    // ProgressCircleComponent,
    IconPickerDirective,
    NumberOnlyDirective,
    LimitToDirective
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    HttpClient,
    ErrorCatcherService,
    {
      provide: Http,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions]
    },
    NotifierService,
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    CalendarComponent,
    DocumentComponent,
    TilesComponent,
    Ng2FilterPipeModule,
    GradesComponent,
    AlertComponent,
    // ProgressCircleComponent,
    BusyLoaderComponent,
    PipesModule,
    IconPickerDirective,
    ChartModule,
    NgbModule,
    FormsModule,
    NumberOnlyDirective,
    LimitToDirective,
    DropdownComponent,
    TimepickerComponent,
    ListComponent,
    FileUploaderComponent,
    ImageUploaderComponent,
    InputComponent,
    SearchComponent,
    TextareaComponent,
    DatepickerComponent,
    PieGradesComponent,
    FileUploadModule,
    TranslateModule
  ]
})

export class SharedModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'hy', 'ru']);
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|hy|ru/) ? browserLang : 'en');
  }
}
