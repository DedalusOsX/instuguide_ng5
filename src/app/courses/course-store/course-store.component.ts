import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';
import { UserService } from '../../services/user.service';
import { CourseRest } from '../../models/course/course-rest.model';

@Component({
  selector: 'course-store',
  templateUrl: 'course-store.component.html',
})
export class CourseStoreComponent implements OnInit {

  public busy: boolean = false;
  public allCourses: CourseRest[];
  public bookmarkedCourses: CourseRest[];

  public filterTypes: any = {
    data: [{
      label: 'All Courses',
      filterParam: 'all'
    }, {
      label: 'Categories',
      filterParam: 'category'
    }, {
      label: 'Bookmarked',
      filterParam: 'bookmarked'
    }],
    selected: 0
  };
  public filter: any = {
    perPage: 6,
    page: 1,
    name: null
  };

  public totalItems: number;
  public isTeacher: boolean;

  constructor(private coursesService: CoursesService, private userService: UserService, private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.getCourses();
    this.userService.currentUser
      .subscribe(user => {
        this.isTeacher = this.userService.isTeacher();
        if (user.bookmarked_courses) {
          this.bookmarkedCourses = user.bookmarked_courses;
          this.cd.markForCheck();
        }
      });
  }

  public getCourses() {
    this.busy = true;
    this.coursesService.getCourses(this.filter)
      .subscribe(result => {
        this.allCourses = result.courses.data;
        this.totalItems = result.courses.items.total;
        this.busy = false;
      }, () => {
        this.busy = false;
      }, () => this.cd.markForCheck());
  }

  public onSetActiveCourseType(i) {
    this.filterTypes.selected = i;
  }

  public bookmarkCourse(course: any) {
    let action = '';
    if (this.isBookmarkBelongsUser(course.id)){
      action = 'unbookmark';
    } else {
      action = 'bookmark';
    }
    this.userService.tryToBookmarkCourse(course, action)
      .subscribe(
      () => { },
      () => { },
      () => this.cd.markForCheck()
      );
  }

  public isBookmarkBelongsUser(courseId: string) {
    return this.userService.isBookmarkBelongsUser(courseId);
  }

  public trackByFn(index) { return index; }
}
