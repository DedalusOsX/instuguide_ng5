import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';
import * as moment from 'moment/moment';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user/user.model';
import { NgForm } from '@angular/forms';
import { NotifierService } from '../shared/services/notifier.service';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm') public form: NgForm;

  public busy = false;
  public backPreview = '';

  public formSubmitted: boolean = false;
  public profile: any = {};
  public auth: any = {};
  public courses: any = [];

  public avatarUploaderOptions: any = {
    allowedFileType: ['image']
  };

  public backgroundUploaderOptions: any = {
    allowedFileType: ['image']
  };

  public isTeacher: boolean;
  public amI: boolean;
  public view: any = {
    mode: 'view'
  };

  public languages = [{
    code: 'en',
    label: 'English'
  }, {
    code: 'hy',
    label: 'Armenian'
  }, {
    code: 'ru',
    label: 'Russian'
  }];

  constructor(private userService: UserService, private authService: AuthService,
              private notifierService: NotifierService, private route: ActivatedRoute,
              private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.currentUser
        .subscribe(user => {
          this.isTeacher = this.userService.isTeacher();
          let profileID = user.id;
          this.setProfileData(user);
          if ('profileId' in params) {
            profileID = params.profileId;
          } else {
            this.amI = true;
          }
          this.userService.getUserById(profileID)
            .subscribe(data => {
              this.setProfileData(data.user);
            });
        });
    });
  }

  public groupByDate(courses: any): any[] {
    let field = 'start_date';
    // if (this.isTeacher) {
    //   field = 'created_at';
    // }
    courses = courses.sort((a, b) => Date.parse(a[field]) - Date.parse(b[field]));
    let grouped = [], gg = 0;
    if (courses.length) {
      let nextItem;
      grouped = [[courses[0]]];
      courses.forEach((course, i) => {
        nextItem = courses[i + 1];
        if (nextItem) {
          if (moment(nextItem[field]).year() != moment(courses[i][field]).year()) {
            grouped.push([]);
            gg++;
          }
          grouped[gg].push(nextItem);
        }
      });
    }
    return grouped;
  }

  public updateProfile() {
    let request = createFormData(this.profile);
    this.busy = true;
    this.userService.updateProfile(request)
      .subscribe((res: any) => {
        this.busy = false;
        this.notifierService.showSuccess('Profile Successfully Updated');
      }, err => {
        this.busy = false;
        this.notifierService.showError(err.fullMessage);
      });
  }

  public updatePassword() {
    this.busy = true;
    this.authService.updatePassword(this.auth)
      .subscribe((res: any) => {
        this.busy = false;
        this.notifierService.showSuccess('Password Successfully Updated');
      }, err => {
        this.busy = false;
        this.notifierService.showError(err.fullMessage);
      });
  }

  public trackByFn(index) { return index; }

  private setProfileData(user: User) {
    this.profile = Object.assign(this.profile, user);
    delete this.profile.email;
    delete this.profile.courses;
    delete this.profile.bookmarked_courses;
    this.backPreview = user.background;
    if (user.courses) {
      this.courses = this.groupByDate(user.courses);
    }
    this.avatarUploaderOptions.previewImage = user.avatar;
    this.backgroundUploaderOptions.previewImage = user.background;
    this.cd.markForCheck();
  }
}
