import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UnitRest } from '../../../../models/unit/unit-rest.model';
import { UnitVideo } from '../../../../models/unit/unit-video.model';

import { LessonModel } from '../../../../models/unit/unit-lesson.model';
import { MaterialsService } from '../materials.service';
import { UserService } from '../../../../services/user.service';
import { NotifierService } from '../../../../shared/services/notifier.service';

@Component({
  selector: 'lesson',
  templateUrl: 'lessons.component.html'
})
export class LessonComponent implements OnInit, OnChanges {
  @Input() public unit: UnitRest;
  @Input('material') public lesson: LessonModel;
  @Output() public updated = new EventEmitter();

  @ViewChild('videoplayerback') public videoplayerback: any;
  @ViewChild('videoplayer') public videoplayer: any;

  public busy = false;
  public teacher: boolean;
  public lessonModel: LessonModel = new LessonModel();

  public uploaderOptionHor = {
    allowedFileType: ['doc', 'docx', 'pdf', 'xls', 'xlxs', 'ppt', 'pptx'],
    structure: 'horizontal'
  };

  public view: any = {
    mode: 'view'
  };

  public videos: UnitVideo[];
  public currentVideo: UnitVideo = <UnitVideo>{};
  private selectedVideo: number;

  constructor(private notifierService: NotifierService, private materialsService: MaterialsService,
              private userService: UserService, public sanitizer: DomSanitizer) {
  }

  public ngOnChanges(changes: SimpleChanges)  {
    if (changes.lesson) {
      this.lesson = changes.lesson.currentValue;
      this.lessonModel = Object.assign({}, this.lesson);
      this.view.mode = 'view';
      if (this.lesson.id && this.lesson.media_links.length) {
        this._installVideo(this.lesson.id);
      }
    }
  }

  public ngOnInit() {
    this.isTeacher();
  }

  public isTeacher() {
    this.userService.currentUser.subscribe(user => {
      return this.teacher = this.userService.isTeacher();
    });
  }

  public submitLesson() {
    this.busy = true;
    this.lessonModel.media_links = this.lessonModel.media_links.filter(Boolean);
    this.materialsService.submitMaterial(this.unit.id, this.lessonModel)
      .subscribe((res: any) => {
        this.busy = false;
        this.lesson = Object.assign({}, res.data.material);
        this.lessonModel = Object.assign({}, this.lesson);
        this.lesson.id = res.data.material._id || res.data.material.id;
        this.updated.emit(this.lesson);
        this.notifierService.showSuccess('Successfully created');
      }, err => {
        this.busy = false;
        this.notifierService.showError(err.fullMessage);
      });
  }

  private _installVideo(id){
    this.materialsService.getVimeoVideo(id)
      .subscribe(res => {
        this.videos = res.videos;
        this.setVideo();
      }, (err) => {
        this.notifierService.showError(err.fullMessage);
      });
  }

  private setVideo(index: number = 0) {
    this.selectedVideo = index;
    this.currentVideo = this.videos[index];
  }
}
