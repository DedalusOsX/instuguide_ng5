import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../courses.service';
import { CourseRest } from '../../models/course/course-rest.model';
import { UserService } from '../../services/user.service';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'course-info',
  templateUrl: 'course-info.component.html',
})
export class CourseInfoComponent implements OnInit {
  // @ViewChild(CalendarComponent) public calendarElement: CalendarComponent;

  public course: CourseRest = <CourseRest> {};

  public eventColors: any = {
    lecture: 'black',
    lesson: 'black',
    class: 'black',
    tutorial: 'green',
    project: 'red'
  };

  public filteredCourseEvents: any;
  public events: Event[] = [];
  public eventTypes: string[] = [];

  public isCourseBelongsUser: boolean;
  public isBookmarkBelongsUser: boolean;
  public isTeacher: boolean;

  constructor(private router: Router, private coursesService: CoursesService,
    private route: ActivatedRoute, private userService: UserService,
    private notifier: NotifierService, private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      if ('courseId' in params) {
        const expand = ['created_by', 'subscribers'];
        this.coursesService.getCourseById(params.courseId, expand)
          .subscribe(data => {
            this.course = data.course;
            this.isTeacher = this.userService.isTeacher();
            this.isCourseBelongsUser = this.userService.isCourseBelongsUser(this.course.id);
            this.isBookmarkBelongsUser = this.userService.isBookmarkBelongsUser(this.course.id);

            if (this.course.schedule.length) {
              this.events = this._prepareScheduleForCalendar();
            }
            this.cd.markForCheck();
          });
      }
    });
  }

  public bookmarkCourse() {
    let action = '';
    if (this.isBookmarkBelongsUser){
      action = 'unbookmark';
    } else {
      action = 'bookmark';
    }
    this.userService.tryToBookmarkCourse(this.course, action)
      .subscribe(
      result => {
        if (action == 'bookmark') {
          this.notifier.showSuccess('Course successfully added to your bookmark list!');
          this.isBookmarkBelongsUser = true;
        } else {
          this.notifier.showSuccess('Course successfully removed from your bookmark list!');
          this.isBookmarkBelongsUser = false;
        }
      },
      err => this.notifier.showError(err.fullMessage),
      () => this.cd.markForCheck()
      );
  }

  public startCourse() {
    this.userService.tryToStartCourse(this.course)
      .subscribe(
      result => {
        this.isCourseBelongsUser = true;
        this.notifier.showSuccess('Course successfully started!');
        this.router.navigate([`courses/my/${this.course.id}`]);
      },
      err => this.notifier.showError(err.fullMessage),
      () => this.cd.markForCheck()
      );
  }

  public onHoverEventType(type: string, state: boolean): void {
    // let activeElemNodes = document.querySelectorAll(`.fc-event[data-event-type="${type}"]`);
    // let passiveElemNodes = document.querySelectorAll(`.fc-event:not([data-event-type="${type}"])`);
    //
    // window.forEach(activeElemNodes, (index, value) => {
    //   value.style.boxShadow = state ? '1px 4px 3px 0px rgba(51, 51, 51, 0.3)' : 'none';
    // });
    //
    // window.forEach(passiveElemNodes, function (index, value) {
    //   value.style.opacity = state ? 0.5 : 1;
    // });
  }

  /**
   * @returns {Array}
   * @private
   */

  private _prepareScheduleForCalendar(): any[] {
    let events = [];

    this.course.schedule.forEach(item => {
      events.push({
        title: item.type,
        location: item.location,
        start_time: item.start_time,
        end_time: item.end_time,
        weekday: this._weekdayNumerical(item.week_days),
        cssClass: 'ical-schedule__event--' + this.eventColors[item.type],
      });
      if (this.eventTypes.indexOf(item.type) > -1){
        return false;
      } else {
        this.eventTypes.push(item.type);
      }
    });
    return events;
  }
  private _weekdayNumerical(weekday) {
    let day = 0;
    weekday = weekday.toLowerCase();

    switch (weekday) {
      case 'monday': day = 0; break;
      case 'tuesday': day = 1; break;
      case 'wednesday': day = 2; break;
      case 'thursday': day = 3; break;
      case 'friday': day = 4; break;
      case 'saturday': day = 5; break;
      case 'sunday': day = 6; break;
      default: day = 0;
    }
    return day;
  }
}
