import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UnitRest } from '../../../../models/unit/unit-rest.model';
import { LessonModel } from '../../../../models/unit/unit-lesson.model';
import { MaterialsService } from '../materials.service';
import { NotifierService } from '../../../../shared/services/notifier.service';

@Component({
  selector: 'practice',
  templateUrl: 'practice.component.html',
  providers: [MaterialsService]

})

export class PracticeComponent implements OnInit {
  @Input() public unit: UnitRest;
  @Input() public selectedMaterial: any;
  @Output() public updated = new EventEmitter();

  @ViewChild('videoplayerback') public videoplayerback: any;
  @ViewChild('videoplayer') public videoplayer: any;

  public busy = false;
  public lessons: any[];

  public lesson: any;
  public newLesson: LessonModel;


  public video: any;
  // public audio: any;

  public selected = {
    lesson: 0,
    video: 0,
    // audio: 0
  };

  public lessonUploaderOpt = {
    allowedFileType: ['doc', 'docx', 'pdf', 'xls', 'xlxs', 'ppt', 'pptx']
  };

  constructor(private notifierService: NotifierService, private materialsService: MaterialsService) {
  }

  public ngOnInit() {
    // this.lessons = this.unit.materials.filter(item => item.type === this.selectedMaterial.field);
    // if (!this.lessons.length) {
    //   this.onAddOne();
    // } else {
    //   this.setActiveLesson();
    // }
  }

  /* onAddOne() {
       this.newLesson = <LessonModel>{
           note: '',
           name: '',
           type: this.selectedMaterial.field,
           media_links: [''],
           media: ''
       };
   }

   setActiveLesson(index: number = 0) {
       this.selected.lesson = index;
       this.lesson = this.lessons[index];
       this.newLesson = null;

       this.setActiveVideo();
   }

   setActiveVideo(index: number = 0){
       this.selected.video = index;
       this.video = this.lesson.media_links[index] || '';
   }

   // setActiveAudio(index: number = 0){
   //   this.selected.audio = index;
   //   this.audio = this.lesson.audios[index] || {};
   // }

   playVideo(event: any){
       this.videoplayerback.nativeElement.parentNode.querySelector('video').play();
   }

   pauseVideo(event: any){
       this.videoplayer.nativeElement.pause();
   }

   setIcon(extension: string){
   let iconimg = '';
   switch (extension) {
       case 'doc':
           iconimg = "/assets/images/fileicons/word.svg";
           break;
       case 'docx':
           iconimg = "/assets/images/fileicons/word.svg";
           break;
       case 'xls':
           iconimg = "/assets/images/fileicons/excel.svg";
           break;
       case 'xlsx':
           iconimg = "/assets/images/fileicons/excel.svg";
           break;
       case 'ppt':
           iconimg = "/assets/images/fileicons/ppoint.svg";
           break;
       case 'pptx':
           iconimg = "/assets/images/fileicons/ppoint.svg";
           break;
       case 'jpg':
           iconimg = "/assets/images/fileicons/jpg.svg";
           break;
       case 'png':
           iconimg = "/assets/images/fileicons/png.svg";
           break;
       case 'pdf':
           iconimg = "/assets/images/fileicons/adobe.svg";
           break;
       default:
           iconimg = "/assets/images/fileicons/randomfile.svg";
   }
 return iconimg;
 }

   private prepareRequest(lesson): FormData {
       let formData = new FormData(); // Currently empty

       if (lesson.media) {
           lesson.media.forEach(file => {
               formData.append('media[]', file._file);
           });
       }

       let json = Object.assign({}, lesson);
       delete json.media;

       formData.append('fields', JSON.stringify(json));
       if (json.id) {
           formData.append('id', json.id);
       }

       return formData;
   }

   submitLesson() {
       let request = this.prepareRequest(this.newLesson);
       this.send(request, unit => {
           this.lessons = unit.materials.filter(item => item.type === this.selectedMaterial.field);
           this.setActiveLesson(this.lessons.length - 1);
           this.notifierService.showSuccess('Successfully created');
           this.updated.emit(unit)
       });
   }

   updateLesson() {
       let request = this.prepareRequest(this.lesson);
       this.send(request, unit => {
           this.unit = unit;
           this.notifierService.showSuccess('Successfully updated');
           this.updated.emit(unit);
       });
   }

   private send(request, cb) {
       this.busy = true;
       this.materialsService.submitMaterial(this.unit.id, request)
           .subscribe((data: any) => {
               this.busy = false;
               cb(data.unit);
           }, err => {
               this.busy = false;
               this.notifierService.showError(err.fullMessage);
           });
   }

   trackByFn(index) { return index; }*/
}
