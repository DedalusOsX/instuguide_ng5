import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CoursesService } from '../courses.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Course, IUnitTypes } from '../../models/course/course.model';
import { Material_Types } from '../../models/unit/unit.model';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { SettingsService } from '../../services/settings.service';
import { CoursesSchedule } from '../../models/course/course-schedule.model';
import { CourseRest } from '../../models/course/course-rest.model';
import { ErrorCatcherService } from '../../shared/services/error-catcher.service';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'course-create',
  templateUrl: 'course-create.component.html',
})
export class CourseCreateComponent implements OnInit, OnDestroy {
  @Input() public course: CourseRest;
  @Output() public updated = new EventEmitter();

  public courseModel: Course | CourseRest;

  public syllabusFileOptions = {
    allowedFileType: ['doc', 'docx', 'pdf', 'xls', 'xlxs', 'ppt', 'pptx'],
    structure: 'vertical'
  };
  public avatarUploaderOptions = {
    allowedFileType: ['image'],
    showAsBackground: '#js-background-preview',
    previewImage: '/assets/images/default_course.png'
  };

  public tinyDatepickerOpt: any = {};
  public timePickerOpt: any = {};
  public formSubmitted: boolean = false;
  public busy: boolean = false;

  public errorMessage: string;
  public courseTypes: string[] = ['online', 'offline'];
  public courseStructures: string[] = ['unit', 'week'];
  public courseCategories: string[] = [];
  public gradeWeights: any[] = [];
  public eventTypes: string[] = [];

  public materialTypes: any[] = Material_Types.toArray();
  public availableUnitMaterials: any = {};
  public unit_available_types: IUnitTypes = <IUnitTypes>{};
  public deliverableTypes: string[] = ['assignment', 'test', 'midterm', 'final_exam', 'project', 'practice'];

  public weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public books: string[] = [];
  public skills: string[] = [];
  public offlineCourses: CoursesSchedule;
  public syllabus: any[] = [];
  public deleted_syllabus: any;
  public avatar: any = '';

  constructor(private router: Router, private errorCatcher: ErrorCatcherService,
    private coursesService: CoursesService, private userService: UserService,
    private notifier: NotifierService, private settingsService: SettingsService) {
    window.onbeforeunload = (e) => {
      let dialogText = 'Are you sure you want to leave, without save?';
      e.returnValue = dialogText;
      return dialogText;
    };
  }

  public ngOnInit() {
    this.settingsService.getSettings()
      .subscribe((data: any) => {
        this.courseCategories = data.course_categories;
      });
    this.courseModel = {
      name: '',
      description: '',
      category: '',
      type: 'online',
      start_date: '',
      end_date: '',
      unit_available_types: [] as string[],
      expecting_grade: 0,
      minimum_pass_grade: 0,
      structure_type: ''
    };
    let offlineCourses;
    if (this.course) {
      for (let key in this.courseModel) {
        if (this.course.hasOwnProperty(key)) {
          this.courseModel[key] = this.course[key];
        }
      }
      this.courseModel.id = this.course.id;
      this.courseModel.syllabus = this.course.syllabus;
      offlineCourses = this.course.schedule;
      this.books = this.course.books;
      this.skills = this.course.skills;
      this.avatarUploaderOptions.previewImage = this.course.avatar;

      delete this.avatarUploaderOptions.showAsBackground;
    }
    this.offlineCourses = new CoursesSchedule(offlineCourses);

    this.materialTypes.forEach(material => {
      if (!this.unit_available_types.hasOwnProperty(material.category)) {
        this.unit_available_types[material.category] = [];
      }
    });
    this.availableUnitMaterials = _.groupBy(this.materialTypes, 'category');
    let defaultMaterial = _.first(this.materialTypes.filter(item => item.field == 'lesson'));

    this.unit_available_types[defaultMaterial.category] = [defaultMaterial.field];
    this.eventTypes.push(defaultMaterial.label);
    this.addGradeMaterial(defaultMaterial);
  }

  public selectType(item) {
    this.courseModel.type = item;
    if (item === 'offline') {
      this.offlineCourses.setActive(item);
      if (!this.offlineCourses.courses.length) {
        this.offlineCourses.add();
      }
    }
  }

  public onSelectedMaterialType(ev: Event, material: any): void {
    let target = <HTMLInputElement>ev.target;
    let category = target.name;
    if (target.type === 'radio') {
      let previousMaterialField = this.unit_available_types[category];
      this.unit_available_types[category] = [material.field];

      let field = _.first(this.materialTypes.filter(item => item.field == previousMaterialField[0]));
      if (field) {
        this.eventTypes = _.filter(this.eventTypes, (o) => o != field.label);
      }
      if (material.category == 'material_types' || material.field == 'tutorial') {
        this.eventTypes.push(material.label);
      }

      // @Override grade weight value
      this.removeGradeMaterial(previousMaterialField);
      this.addGradeMaterial(material);

    } else { // checkbox
      let ind = this.unit_available_types[category].indexOf(material.field);
      if (ind > -1) {
        this.unit_available_types[category].splice(ind, 1);
        this.eventTypes.splice(ind, 1);
        this.removeGradeMaterial(material.field);
      } else {
        this.unit_available_types[category].push(target.value);
        if (material.category == 'material_types' || material.field == 'tutorial') {
          this.eventTypes.push(material.label);
        }
        this.addGradeMaterial(material);
      }
    }
  }

  public onSelectedStartDate(date: string) {
    if (date) {
      let nextMonth = new Date(new Date(date).setMonth((new Date(date).getMonth() + 1)));
      this.courseModel.start_date = date;
      this.courseModel.end_date = '';
      this.tinyDatepickerOpt.disableFrom = nextMonth;
    }
  }

  public onStartTimeSelected(i, timeAsMinutes) {
    if (timeAsMinutes) {
      this.offlineCourses.courses[i].startTime = timeAsMinutes;
      this.offlineCourses.courses[i].endTime = timeAsMinutes + 60;
      this.timePickerOpt.disableFrom = timeAsMinutes;
    }
  }

  public onSetScheduleType(i, value: string) {
    let material = this.materialTypes.find(item => item.label === value);
    if (material) {
      this.offlineCourses.courses[i].eventType = material.field;

    }
  }

  public submitCourse(e, form: NgForm) {
    e.preventDefault();
    this.formSubmitted = true;

    if (form.invalid) {
      this.notifier.showError('Please fill required fields');
      return false;
    }

    this.busy = true;

    let dataToSent: any = {
      deleted_syllabus: this.deleted_syllabus,
      books: this.books.filter(book => book),
      skills: this.skills.filter(skill => skill),
      grade_distribution: [],
      // syllabus: this.syllabus.slice(0),
      // avatar: ''
    };

    for (let i = 0; i < this.gradeWeights.length; i++ ) {
      const grade = this.gradeWeights[i];

      if (this.deliverableTypes.includes(grade.field) && !grade.value) {
        return this.notifier.showError(`Please fill grade distribution info`);
      }

      dataToSent.grade_distribution.push({
        type: grade.field,
        value: grade.value
      });
    }

    if (this.courseModel.type == 'offline') {
      if (!this.offlineCourses.courses.length) {
        this.notifier.showError(`Please fill offline course info`);
        this.busy = false;
        return false;
      } else {
        this.errorMessage = '';
      }

      let schedule = [];
      this.offlineCourses.courses.forEach(course => {
        schedule.push({
          type: course.eventType,
          week_days: course.weekDay,
          start_time: course.startTime,
          end_time: course.endTime,
          location: course.location
        });
      });

      dataToSent.schedule = schedule;
    }

    this.courseModel.unit_available_types.length = 0;
    for (let category in this.unit_available_types) {
      if (category in this.unit_available_types) {
        this.unit_available_types[category].forEach(item => {
          this.courseModel.unit_available_types.push(item);
        });
      }
    }
    // receive form checkboxes and radio buttons
    for (let key in this.courseModel) {
      if (this.courseModel.hasOwnProperty(key)) {
        dataToSent[key] = this.courseModel[key];
      }
    }
    let formData = new FormData();
    if (this.avatar) {
      formData.append('avatar', this.avatar._file);
    }

    if (this.syllabus.length) {
      this.syllabus.forEach(item => {
        formData.append('syllabus', item)
      });
    }

    formData.append('fields', JSON.stringify(dataToSent));

    this.coursesService.submitCourse(formData, this.courseModel.id)
      .subscribe(res => {
        this.busy = false;
        let course = res.course;
        this.userService.addNewCourse(course);
        if (this.courseModel.id) {
          this.updated.emit(course);
          this.notifier.showSuccess('Course successfully updated!');
        } else {
          this.notifier.showSuccess('Course successfully created!');
          this.router.navigate([`courses/my/${course.id}`]);
        }
      },
      err => {
        this.busy = false;
        this.errorCatcher.setFieldError(err, form);
        this.notifier.showError(err.fullMessage);
        window.scrollTo(0, 0);
      });
  }

  public trackByFn(index) {
    return index;
  }

  public ngOnDestroy() {
    window.onbeforeunload = null;
  }

  private addGradeMaterial(material) {
    if (this.deliverableTypes.includes(material.field)) {
      this.gradeWeights.push({
        name: material.label,
        field: material.field,
        value: 0
      });
    }
  }

  private removeGradeMaterial(field) {
    if (field) {
      this.gradeWeights = _.filter(this.gradeWeights, (o) => o.field != field);
    }
  }
}
