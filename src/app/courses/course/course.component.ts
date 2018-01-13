import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TileInterface } from '../../shared/interfaces/tile.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorCatcherService } from '../../shared/services/error-catcher.service';
import { UserService } from '../../services/user.service';
import { GradesService } from '../../services/grades.service';
import { CourseRest } from '../../models/course/course-rest.model';
import { UnitsService } from '../units.service';
import { UnitRest } from '../../models/unit/unit-rest.model';
import { User } from '../../models/user/user.model';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { NotifierService } from '../../shared/services/notifier.service';

export class NewUnitModel {
  public name: string = '';
  public avatar: any = '';
}

@Component({
  selector: 'course',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: 'course.component.html',
})
export class CourseComponent implements OnInit {
  public busy = false;
  public course: CourseRest = <CourseRest>{};
  public gpa: number;
  public units: UnitRest[] = [];
  public unit: NewUnitModel;

  public courseTable: any[] = [];
  public courseGradeData: any[] = [];

  public unitFilter: any = { title: '' };

  public user: User;
  public dashTiles: TileInterface[] = [
    { label: 'Course Materials', icon: '/assets/coloredIcons/materials.svg' },
    { label: 'Grades', icon: '/assets/coloredIcons/grades.svg' },
  ];
  public isTeacher: boolean;
  public view: any = {
    gradeType: 'diagram'
  };
  public dashViewMode: number;
  public avatarUploaderOptions: any = {
    allowedFileType: ['image'],
    previewImage: '/assets/images/default_course.png'
  };
  private location: Location;

  constructor(location: Location, private errorCatcher: ErrorCatcherService, private userService: UserService,
    private gradesService: GradesService, private route: ActivatedRoute,
    private router: Router, private unitsService: UnitsService, private notifierService: NotifierService,
    private cd: ChangeDetectorRef) {
    this.location = location;
  }

  public ngOnInit() {
    this.userService.currentUser
      .subscribe(user => {
        this.user = user;
        this.isTeacher = this.userService.isTeacher();
        // if (this.isTeacher) {
        //   this.dashTiles.push(
        //     { label: 'Course Settings', color: 'red', icon: 'icon-settings' }
        //   );
        // }
      });

    this.route.params.subscribe(params => {
      if ('courseId' in params) {
        this.busy = true;
        this.userService.getUserCourseById(params['courseId'])
          .subscribe(data => {
            this.course = data.course;
            this.gpa = data.gpa;
            this.units = this.course.units;
            this.busy = false;
            this.cd.markForCheck();
          }, err => {
            this.busy = false;
            this.router.navigate(['/app']);
          });
      }
    });

  }

  public onUpdatedFromSettings(data) {
    this.course = data;
  }

  public isLocked(status: string) {
    return !this.isTeacher && status === 'locked';
  }

  public onSetTileActive(index: number) {
    if (this.dashViewMode === index) {
      return;
    }
    this.dashViewMode = index;
    this.view.gradeType = '';
    if (this.dashViewMode === 1) {
      const gpaStream = this.gradesService.getCourseGPA(this.course.id);
      const tableStream = this.gradesService.getCourseGrades(this.course.id);
      const deliverableStream = this.gradesService.getCourseDeliverable(this.course.id);

      this.busy = true;
      Observable.forkJoin(gpaStream, tableStream, deliverableStream)
        .subscribe((resultArray: any[]) => {
          this._initGPAChart(resultArray[0].response, resultArray[2].response);
          this._initTableChart(resultArray[1].result);
          this.view.gradeType = 'diagram';
          this.busy = false;
          this.cd.markForCheck();
        });
    }
  }

  public navigateToUnit(unitId: string) {
    return this.router.navigate(['/courses/my', this.course.id, 'units', unitId]);
  }

  public newUnit() {
    this.unit = new NewUnitModel();
  }

  public createUnit() {
    const json = {
      name: this.unit.name,
      course_id: this.course.id,
      avatar: this.unit.avatar._file
    };
    const request = createFormData(json);
    this.unitsService.createUnit(request)
      .subscribe((data: any) => {
        this.course.units.push(data.unit);
        this.unit = null;
        this.navigateToUnit(data.unit.id);
      }, (err) => {
        this.notifierService.showError(err.fullMessage);
      });
  }

  public trackByFn(index: number) { return index; }

  private _initGPAChart(gpaData: any, deliverable: any) {
    gpaData.data.forEach(item => {
      item[2] = 'GPA';
      this.courseGradeData.push(item);
    });
    deliverable.data.forEach(item => {
      this.courseGradeData.push(item);
    });
  }

  private _initTableChart(tableData: any) {
    this.courseTable.length = 0;
    tableData.forEach((column, index) => {
      this.courseTable.push({
        name: column.material_type + ' ' + column.material_index,
        data: [{
          name: column.student_id,
          grade: column.grade
        }]
      });
      // column.answers.forEach(student => {
      //   this.courseTable[index].data.push({
      //     name: student.student_id,
      //     grade: student.grade
      //   });
      // });
    });
  }

}
