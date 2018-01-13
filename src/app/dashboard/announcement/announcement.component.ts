import { Component, OnInit } from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'announcement',
  templateUrl: 'announcement.component.html',
})
export class AnnouncementComponent implements OnInit {

  public courses: any;
  public coursesIds: string[];

  public activeCourse: any;

  public announcements: any;
  public activeAnnouncement: any;

  public filteredAnnouncements: any;
  public sortTypes: any;

  constructor() {
    // constructor
  }

  public ngOnInit() {

    this.courses = {
      data: [
        {
          id: 1,
          name: 'Aspen12',
          image: '/assets/images/courses/art1.png'
        },
        {
          id: 2,
          name: 'GEN01',
          image: '/assets/images/courses/art2.png'
        },
        {
          id: 3,
          name: 'ASIC69',
          image: '/assets/images/courses/art3.png'
        },
        {
          id: 4,
          name: 'GEN01',
          image: '/assets/images/courses/art2.png'
        },
        {
          id: 5,
          name: 'ASIC69',
          image: '/assets/images/courses/art3.png'
        },
        {
          id: 6,
          name: 'GEN01',
          image: '/assets/images/courses/art2.png'
        },
        {
          id: 7,
          name: 'ASIC69',
          image: '/assets/images/courses/art3.png'
        },
        {
          id: 8,
          name: 'GEN01',
          image: '/assets/images/courses/art2.png'
        },
        {
          id: 9,
          name: 'ASIC69',
          image: '/assets/images/courses/art3.png'
        }
      ]
    };
    this.coursesIds = this.courses.data.byField('id');

    this.announcements = [
      {
        id: 1,
        from: 'Naomi Moreno',
        to: 'All Students of course ASPEN12',
        subject: 'History of Aerospace engineering',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut ea eos exercitationem iste minus nam, quibusdam similique sit.',
        date: 1481457600000,
        attachments: [{
          file: 'https://drive.google.com/drive/u/1/folders/0B-Wg43LBve0oNDJRY0NEQ1FDVGM',
          name: 'Attachemnt',
          size: 1024000,
          ext: 'doc'
        }, {
          file: 'https://drive.google.com/drive/u/1/folders/0B-Wg43LBve0oNDJRY0NEQ1FDVGM',
          name: 'Attachemnt 2',
          size: 204000,
          ext: 'pdf'
        }],
        avatar: '/assets/images/courses/art3.png',
        courseId: 1,
        read: 0
      },
      {
        id: 2,
        from: 'Naomi Moreno',
        to: 'All Students of course GEN01',
        subject: 'History of Aerospace engineering',
        text: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit. Adipisci asperiores aut ea eos exercitationem iste minus nam, quibusdam similique sit.',
        date: 1481457600000,
        attachments: [{
          file: 'https://drive.google.com/drive/u/1/folders/0B-Wg43LBve0oNDJRY0NEQ1FDVGM',
          name: 'Attachemnt',
          size: 1024,
          ext: 'doc'
        }],
        avatar: '/assets/images/courses/art3.png',
        courseId: 2,
        read: 0
      },
      {
        id: 3,
        from: 'Naomi Moreno',
        to: 'All Students of course GEN01',
        subject: 'History of Aerospace engineering',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut ea eos exercitationem iste minus nam, quibusdam similique sit.',
        date: 1481457600000,
        attachments: [{
          file: 'https://drive.google.com/drive/u/1/folders/0B-Wg43LBve0oNDJRY0NEQ1FDVGM',
          name: 'Attachemnt',
          size: 1024,
          ext: 'doc'
        }],
        avatar: '/assets/images/courses/art3.png',
        courseId: 3,
        read: 1
      }
    ];
    this.announcements = List(this.announcements);

    this.sortTypes = {
      data: ['All Messages', 'Sent', 'Inbox'],
      selected: 0
    };

    this.filteredAnnouncements = this.filterByCourse();
    this.calcUnreadAnnouncements();
  }

  public filterByType(index: number) {
    this.sortTypes.selected = index;
  }

  public trackByFn(index) {
    return index;
  }

  public onSetActiveCourse(index: number) {
    let course = this.courses.data[index];

    this.activeCourse = (!this.activeCourse || this.activeCourse.id !== course.id) ? course : null;
    this.filteredAnnouncements = this.filterByCourse(this.activeCourse);
    this.activeAnnouncement = null;
  }

  public onSetActiveAnnouncement(message: any) {
    this.activeAnnouncement = message;
  };

  private filterByCourse(course?: any) {
    if (!course) {
      return this.announcements.toArray();
    }
    return this.announcements
      .filter(item => item.courseId == course.id)
      .toArray();
  }

  private calcUnreadAnnouncements() {
    this.announcements.forEach(item => {
      if (!item.read) {
        let ind = this.coursesIds.indexOf(item.courseId);
        if (ind > -1) {
          let course = this.courses.data[ind];
          if (!course.hasOwnProperty('notificationsCount')) {
            course.notificationsCount = 0;
          }
          course.notificationsCount++;
        }
      }
    });
  };

}
