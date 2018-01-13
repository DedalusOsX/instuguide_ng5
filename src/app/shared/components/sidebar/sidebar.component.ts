import { Component, ElementRef, HostListener, OnInit, } from '@angular/core';
import { CourseRest } from '../../../models/course/course-rest.model';
import { Router } from '@angular/router';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  public sidebarOpened: boolean = false;
  public activeLink: string;
  public courses: any[];
  public currentUser: User = new User();
  constructor(private router: Router, private userService: UserService) {
  }

  public ngOnInit() {
    this.userService.currentUser
      .subscribe((user: User) => {
        this.courses = user.courses;
      }, err => {
        console.error('Can\'t subscribe to receive user object error');
      });
  }

  public navigateToCourse(course: CourseRest) {
    this.activeLink = '';
    this.sidebarOpened = false;
    this.router.navigate(['/courses/my', course.id]);
  }

  public logout() {
    // this.auth.logout();
  }
}
