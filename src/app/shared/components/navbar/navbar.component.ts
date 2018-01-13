import { Component, EventEmitter, HostListener, OnInit, Output, } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user/user.model';
import { CourseRest } from '../../../models/course/course-rest.model';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public courses: any[];
  public currentUser: User = new User();
  public activeDropdown = false;

  @Output() public onItemClick: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService,
              private userService: UserService) {
}

  public ngOnInit() {
    this.userService.currentUser
      .subscribe(user => {
        this.currentUser = user;
        if (user.courses) {
          this.courses = user.courses;
        }
      });
  }

  public logout(): void {
    this.authService.logout();
  }
}
