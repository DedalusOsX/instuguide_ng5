import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NotifierService } from './shared/services/notifier.service';
import { User } from './models/user/user.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public user: User;
  public sidebarOpened: boolean;
  public location: string;
  public busy: boolean;

  constructor(private notifierService: NotifierService, private vcr: ViewContainerRef, private router: Router, private userService: UserService) {
    this.notifierService.setViewContainer(vcr);
  }

  public navbarUpdate(action: string) {
    if (action === 'OPEN_COURSES') {
      this.sidebarOpened = !this.sidebarOpened;
    }
  }

  public ngOnInit() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

    this.userService.currentUser
      .subscribe(user => {
        this.user = user;
      });
  }
}
