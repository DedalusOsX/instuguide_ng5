import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TileInterface } from '../shared/interfaces/tile.interface';
import { UserService } from '../services/user.service';
import { GradesService } from '../services/grades.service';

import { User } from '../models/user/user.model';
import { CourseRest } from '../models/course/course-rest.model';
import { Observable } from 'rxjs/Rx';
import { NotifierService } from '../shared/services/notifier.service';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public busy = false;
  public currentUser: User;

  public dashTiles: TileInterface[] = [
    { label: 'My Courses', icon: '/assets/coloredIcons/materials.svg' },
    { label: 'Grades', icon: '/assets/coloredIcons/grades.svg' },
  ];

  public courseDynamicData: any[] = [];
  public gpaDynamicData: any[] = [];

  // public currentFilterRange: string;
  // public currentCourseFilter: string;
  public courses: CourseRest[];
  public view: any = {
    mode: 0,
    gradeType: ''
  };

  constructor(private router: Router, private userService: UserService,
    private gradesService: GradesService, private cd: ChangeDetectorRef,
    private notifierService: NotifierService) {

  }

  public ngOnInit() {
    // this.currentFilterRange = 'all';
    // this.currentCourseFilter = '';
    this.userService.currentUser
      .subscribe(user => {
        this.currentUser = user;
        this.courses = user.courses;
        this.cd.markForCheck();
      });
  }

  public onSetTileActive(index: number) {
    if (this.view.mode === index) {
      return;
    }
    this.view.mode = index;
    this.view.gradeType = '';
    if (this.view.mode === 1) {
      this.busy = true;
      let gpaStream = this.gradesService.getCourseGPA();
      let allGradesStream = this.gradesService.getCourseDeliverable();
      Observable.forkJoin(gpaStream, allGradesStream)
        .subscribe((resultArray: any) => {
          this.gpaDynamicData = resultArray[0].response;
          this.courseDynamicData = resultArray[1].response;
          this.view.gradeType = 'gpa';
          this.busy = false;
        }, err => {
          this.busy = false;
          this.notifierService.showError(err.fullMessage);
        }, () => this.cd.markForCheck());
    }
  }

  public navigateToAddCourse() {
    this.router.navigate([this.currentUser.role === 'student' ? '/courses' : '/courses/new']);
  }

  public trackByFn(index) { return index; }

  // filterSliderByType(type: string): void {
  //   this.currentCourseFilter = this.currentCourseFilter === type ? '' : type;
  //   if (this.currentCourseFilter) {
  //     this.filteredCourses = this.courses.filter((item) => item.type === type).toArray();
  //   } else {
  //     this.filteredCourses = this.courses.toArray();
  //   }
  // }
}
