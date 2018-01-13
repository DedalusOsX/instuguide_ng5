import {Component, OnDestroy, OnInit} from '@angular/core';
import { UnitRest } from '../../models/unit/unit-rest.model';
import { CourseRest } from '../../models/course/course-rest.model';

import { LessonModel } from '../../models/unit/unit-lesson.model';
import { AssignmentModel } from '../../models/unit/unit-assignment.model';

import { ActivatedRoute, Router } from '@angular/router';
import { UnitsService } from '../units.service';
import { UserService } from '../../services/user.service';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'units',
  templateUrl: 'units.component.html'
})

export class UnitsComponent implements OnInit, OnDestroy {

  public course: CourseRest = <CourseRest>{};
  public units: UnitRest[] = [];
  public unit: UnitRest = <UnitRest>{};
  public material: any = {};

  public unitType: string;
  public materialTypes: any[] = [];

  public selectedUnit: number;
  public selectedMaterial: number;

  public avatarUploaderOptions: any = { allowedFileType: ['image'] };

  public teacher: boolean;
  public busy: boolean = false;

  public view: any = {
    settings: false,
    material: 'default',
    materialNew: false,
    fullScreen: false
  };

  constructor(private route: ActivatedRoute, private router: Router, private unitsService: UnitsService, private userService: UserService, private notifier: NotifierService) {
  }

  public ngOnInit() {
    this.isTeacher();
    this.route.params.subscribe(params => {
      this.userService.getUserCourseById(params['courseId'])
        .subscribe(data => {
          this.course = data.course;
          this.units = data.course.units;
          this.unitType = data.course.structure_type;
          this.materialTypes = data.course.unit_available_types;
          let index = this.units.findIndex(item => item.id == params.unitId);
          if (index > -1) {
            this.setUnit(index);
          } else {
            this.setUnit();
          }
        }, err => {
          this.router.navigate(['/app']);
        });
    });
  }

  public isTeacher() {
    this.userService.currentUser.subscribe(user => {
      return this.teacher = this.userService.isTeacher();
    });
  }

  public isLocked(status: string) {
    return !this.teacher && status === 'locked';
  }

  public setUnit(index: number = 0) {
    this.selectedUnit = index;
    this.unit = Object.assign({}, this.units[index]);
    if (!this.teacher) {
      this.unit.materials = this.unit.materials.filter((material) => material.status === 'unlocked');
    }
    this.avatarUploaderOptions.previewImage = this.unit.avatar;
    this.setMaterial();
  }

  public navigateToUnit(unitId) {
    this.router.navigate(['/courses/my', this.course.id, 'units', unitId]);
  }

  public setMaterial(index: number = 0) {
    if (this.unit.materials) {
      let material = this.unit.materials[index];
      this.view.material = (material ? material.type : 'default');
      this.material = Object.assign({}, material);
      this.selectedMaterial = index;
    }

  }

  public createMaterial(materialType: string) {
    this.view.material = materialType;
    if (['lesson', 'lecture', 'class', 'tutorial'].includes(materialType)) {
      this.material = new LessonModel();
      this.material.type = materialType;
    } else if (['assignment', 'test', 'midterm', 'final_exam'].includes(materialType)) {
      this.material = new AssignmentModel();
      this.material.type = materialType;
    } else {
      return false;
    }
  }

  public toggleFullScreen(fullScreen = this.view.fullScreen) {
    let element = <any>document.body;
    let origin = 'requestFullScreen'
      , moz = 'mozRequestFullScreen'
      , webkit = 'webkitRequestFullScreen'
      , ms = 'msRequestFullscreen';
    if (fullScreen) {
      element = document;
      origin = 'exitFullscreen';
      moz = 'mozCancelFullScreen';
      webkit = 'webkitCancelFullScreen';
      ms = 'msCancelFullScreen';
    }

    this.view.fullScreen = !fullScreen;

    if (element[origin]) {
      element[origin]();
    } else if (element[moz]) {
      element[moz]();
    } else if (element[webkit]) {
      element[webkit]();
    } else if (element[ms]) {
      element[ms]();
    }
  }
  public onUpdatedFromMaterial(data) {
    let index = this.units[this.selectedUnit].materials.findIndex(item => item.id == data.id);
    if (index > -1) {
      this.units[this.selectedUnit].materials[this.selectedMaterial] = Object.assign({}, data);
      // this.course.used_grades[this.material.type] = data.usedTotalWeight;
      this.setMaterial(index);
    } else {
      this.units[this.selectedUnit].materials.push(data);
      // this.course.used_grades[this.material.type] = data.usedTotalWeight;
      this.setMaterial(this.units[this.selectedUnit].materials.length - 1);
    }
  }

  public removeMaterial(i) {
    let material = this.unit.materials[i];
    if (!material.id) {
      this.material = {};
      this.unit.materials.splice(i, 1)
    }
  }

  public updateUnit(field, value) {
    let request: any = { [field]: value };
    if (field === 'avatar') {
      request = createFormData(request);
    }
    this.busy = true;
    this.unitsService.updateUnit(request, this.unit.id)
      .subscribe((data: any) => {
        this.units[this.selectedUnit] = Object.assign({}, data.unit);
        this.setUnit(this.selectedUnit);
        this.busy = false;
        this.notifier.showSuccess('Unit successfully updated');
      }, err => {
        this.busy = false;
        this.notifier.showError(err.fullMessage);
      });
  }

  public trackByFn(index) {
    return index;
  }

  public ngOnDestroy() {
    this.toggleFullScreen(true);
  }
}
