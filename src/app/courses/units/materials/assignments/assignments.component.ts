import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AssignmentModel } from '../../../../models/unit/unit-assignment.model';
import { AnswerModel, AnswerRestModel } from '../../../../models/unit/unit-answer.model';
import { UnitRest } from '../../../../models/unit/unit-rest.model';
import { MaterialsService } from '../materials.service';
import { UserService } from '../../../../services/user.service';
import { AnswerService } from '../../../../services/answer.service';
import { NotifierService } from '../../../../shared/services/notifier.service';
import { Material_Types } from '../../../../models/unit/unit.model';
import * as moment from 'moment/moment';

export class GradeModel {
  unit_id: string;
  material_id: string;
  material_type: string;
  material_index: number;
  course_id: string;
  student_id: string;
  grade: number;
  feedback: string;
  type: string;
}

@Component({
  selector: 'assignment',
  templateUrl: 'assignments.component.html'
})

export class AssignmentComponent implements OnInit, OnChanges {
  @Input() public studentList: any[] = [];
  @Input() public unit: UnitRest;
  @Input() public gradeWeights: any;
  @Input() public usedWeight: any;
  @Input() public courseDeadline: string;
  @Input() public colorScheme: string;
  @Input('material') public assignment: AssignmentModel;
  public assignmentStatus: string;

  @Output() public updated: EventEmitter<any> = new EventEmitter();

  public busy = false;
  public user: any;
  public teacher: boolean;
  public today: Date = new Date();
  public gradeCount: number;
  public submitCount: number;

  public uploadPermission: boolean;
  public answers: any;
  public answer: AnswerModel;
  public gradeModel: GradeModel = new GradeModel();
  public datepickerOpt: any = {};
  public gradeWeightsChartOptions: any;
  public availableWeight: number;
  public filterStudent: string[] = ['All', 'Graded', 'Not Graded', 'Submitted', "Not Submitted"];
  public tempAssignmentWeight: number;

  public uploaderOptionHor = {
    allowedFileType: ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'],
    structure: 'horizontal'
  };

  public chart: any;
  public view: any = {
    mode: 'view',
    grade: 2
  };

  constructor(private materialsService: MaterialsService,
    private notifierService: NotifierService,
    private userService: UserService,
    public answerService: AnswerService) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.assignment) {
      this._installAssignment(changes.assignment.currentValue);
      if (this.assignment.id) {
        this._getAnswers();
      }
    }
  }

  public ngOnInit() {
    this.isTeacher();
    this.getUser();
  }

  public isTeacher() {
    this.userService.currentUser.subscribe(user => {
      return this.teacher = this.userService.isTeacher();
    });
  }

  public getUser() {
    this.userService.currentUser.subscribe(user => {
      this.user = Object.assign({}, user);
    });
  }

  public _getAnswers() {
    this.busy = true;
    this.answerService.getMaterialAnswers(this.unit.course_id, this.assignment.id)
      .subscribe(res => {
        if (this.teacher) {
          this.answers = res.answers;
          this._createStudentList();
          this._updateGradeCount();
          this._updateAnswerCount();
        } else {
          this._installAnswer(res);
        }
        this._checkAssignmentStatus(this.answer);
        this.busy = false;
      }, () => {
        this.busy = false;
      });
  }

  public toggleGrade(student: any, status: boolean) {
    (<any>this.gradeModel) = Object.assign({}, {
      unit_id: student.answer.student_id,
      material_id: this.assignment.id,
      material_type: this.assignment.type,
      material_index: this.assignment.index,
      course_id: student.answer.student_id,
      student_id: student.id,
      grade: student.answer.grade,
      feedback: student.answer.feedback,
      // type:  ES OVAAAAA????
    });
  }

  public submitAssignment() {
    this.busy = true;
    this.assignment.weight = this.tempAssignmentWeight;

    this.materialsService.submitMaterial(this.unit.id, this.assignment)
      .subscribe((res: any) => {
        this.busy = false;
        this.assignment = Object.assign({}, res.data.material);
        this.assignment.id = res.data.material._id || res.data.material.id;
        this.notifierService.showSuccess('Successfully created');
        this.updateAssignmentWeight();

        this.updated.emit(this.assignment);
      }, err => {
        this.busy = false;
        this.notifierService.showError(err.fullMessage);
      });
  }

  public submitAnswer() {
    if (!this.answer.content.length) {
      return this.notifierService.showError("Your can/'t leave submit field empty");
    }

    this._prepareAnswer();
    this.busy = true;
    this.answerService.submitAnswer(this.answer)
      .subscribe(res => {
        this._installAnswer(res);
        this.busy = false;
        this.notifierService.showSuccess('Your answer successfully updated');
      }, (err) => {
        this.busy = false;
        this.notifierService.showError(err.fullMessage);
      });
  }

  public setGradeModel(answer) {
    (<any>this.gradeModel) = {
      grade: answer.grade,
      feedback: answer.feedback
    };
  }

  public submitGrade(student) {
    this.busy = true;
    this.gradeModel = Object.assign(this.gradeModel, {
      unit_id: this.unit.id,
      material_id: this.assignment.id,
      material_type: this.assignment.type,
      material_index: this.assignment.index,
      course_id: this.unit.course_id,
      student_id: student._id,
      answer_id: student.answer._id
    });

    let index = this.studentList.findIndex(o => o._id === student._id);
    this.answerService.submitGrade(this.gradeModel)
      .subscribe((res: any) => {
        this.busy = false;
        this.notifierService.showSuccess('Successfully Graded');
        this._updateStudent(index, res.answer);
        this._updateGradeCount();
        this.gradeModel = new GradeModel();
      }, err => {
        this.busy = false;
        this.notifierService.showError(err.fullMessage);
      });
  }

  public checkUploadPermission(item, deadline) {
    let now = (new Date()).getTime();
    let deadlineConverted = (new Date(deadline)).getTime();
    if (item.hasOwnProperty('grade')) {
      this.uploadPermission = false;
      return false;
    } else {
      if (now < deadlineConverted) {
        this.uploadPermission = true;
        return true;
      } else {
        this.uploadPermission = false;
        return false;
      }
    }
  }

  public _checkAssignmentStatus(item) {
    if (this.teacher) {
      this.assignmentStatus = this.today > this.assignment.end_date ? 'completed' : 'pending';
    } else {
      if (item.content && item.content.length) {
        this.assignmentStatus = 'completed';
      } else {
        this.assignmentStatus = this.uploadPermission ? 'pending' : 'failed';
      }
    }
  }

  public updateAssignmentWeight() {
    let delta = this.tempAssignmentWeight - this.assignment.weight;
    let totalWeight = this.gradeWeights.find(item => item.type === this.assignment.type);
    this.chart.series[0].update({
      name: this.assignment.id ? `${this.assignment.type} ${this.assignment.index}` : 'New Assignment',
      data: [Number(this.tempAssignmentWeight)]
    });
    this.chart.title.update({
      text: `Available: ${totalWeight.value - this.usedWeight[this.assignment.type] - (delta ? delta : this.tempAssignmentWeight)}%`,
    });
  }

  private _prepareAnswer() {
    this.answer.course_id = this.unit.course_id;
    this.answer.material_id = this.assignment.id;
    this.answer.student_id = this.user.id;
    this.answer.unit_id = this.unit.id;
  }


  private _installChart() {
    let series = [{
      name: this.assignment.id ? `${this.assignment.type} ${this.assignment.index}` : 'New Assignment',
      data: [this.assignment.id ? this.assignment.weight : 0]
    }];

    let legendColor = [];
    let totalWeight = this.gradeWeights.find(item => item.type === this.assignment.type);

    legendColor.push('#1ecd97');
    legendColor.unshift(this.colorScheme === 'dark' ? '#ffffff' : '#333333');

    this.availableWeight = totalWeight.value - this.usedWeight[this.assignment.type];
    this.gradeWeightsChartOptions = {
      chart: {
        type: 'bar',
        height: 111,
        backgroundColor: '#E7E8E9',
        plotBackgroundColor: '#B0B2B4'
      },
      colors: ['#1ecd97', '#4d9de0', '#FAC63F', '#ff3f46', '#00BCF9', '#333333'],
      exporting: {
        buttons: { contextButton: { enabled: false } }
      },
      credits: { enabled: false },
      title: {
        text: `Available: ${this.availableWeight}%`,
        align: 'left'
      },
      xAxis: {
        height: 10,
        visible: false
      },
      yAxis: {
        min: 0,
        max: totalWeight.value,
        reversedStacks: false,
        visible: false
      },
      legend: {
        align: 'left',
        labelFormatter: function() {
          let total = 0;
          for (let i = 0; i < this.yData.length; i++) {
            total += this.yData[i];
          }
          return '<span>' + this.name + ': </span><span>' + total + '%</span>';
        }
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          grouping: false
        },
        series: {
          stacking: 'normal',
          pointWidth: 18,
          animation: {
            duration: 2000,
            easing: 'easeOutBounce'
          }
        }
      },
      tooltip: {
        enabled: false,
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadow: false,
        animation: true,
        hideDelay: 300,
        useHTML: true,
        positioner: function() {
          return { x: 0, y: 0 };
        },
        formatter: function() {
          return '' + this.series.name + ': <b>' + this.y + '%</b>';
        }
      },
      series
    };
  }

  private _installAssignment(assignment) {
    this.assignment = assignment;
    this.answer = new AnswerRestModel();
    this.view.mode = 'view';
    this._installChart();
  }

  private _installAnswer(res) {
    this.answer = res.answer;
    this.checkUploadPermission(this.answer, this.assignment.end_date);
  }

  private _updateStudent(index, res) {
    // this.tempStudentList[index].answer_id = res._id;
    // this.tempStudentList[index].reviewed = res.reviewed;
    // this.tempStudentList[index].grade = res.grade;
    // this.tempStudentList[index].feedback = res.feedback;
  }

  private _updateGradeCount() {
    this.gradeCount = 0;
    this.studentList.forEach(student => {
      if (student.grade != null) {
        this.gradeCount += 1;
      }
    });
  }

  private _updateAnswerCount() {
    this.submitCount = 0;
    this.studentList.forEach(student => {
      if (student.answer.content && student.answer.content.length) {
        this.submitCount += 1;
      }
    });
  }

  private _createStudentList() {
    // this.studentList = [];
    // this.tempStudentList = [];
    this.studentList = this.studentList.map((student, index) => {
      const _answer = this.answers.find(o => student.id === o.student_id._id);
      student.answer = new AnswerModel();
      if (_answer) {
        student.answer = _answer;
      }
      return student;
      // return {
      //   first_name: student.first_name,
      //   last_name: student.last_name,
      //   avatar: student.avatar,
      //   grade: null,
      //   feedback: null,
      //   content: [],
      //   reviewed: [],
      //   deleted_reviewed: [],
      //   unit_id: this.unit.id,
      //   material_id: this.assignment.id,
      //   course_id: this.unit.course_id,
      //   type: this.assignment.type,
      //   student_id: student.id,
      //   answer_id: ''
      // }
    });
    // this.tempStudentList.push({
    //   grade: null,
    //   feedback: null,
    //   reviewed: [],
    //   deleted_reviewed: [],
    //   unit_id: this.unit.id,
    //   material_id: this.assignment.id,
    //   course_id: this.unit.course_id,
    //   type: this.assignment.type,
    //   student_id: student.id,
    //   answer_id: ''
    // });
    // this.answers.forEach(repliedstudent => {
    //   if (student.id === repliedstudent.student_id._id) {
    //     this.studentList[index].content = repliedstudent.content;
    //     this.studentList[index].grade = repliedstudent.grade;
    //     this.studentList[index].answer_id = repliedstudent._id;
    //     this.studentList[index].feedback = repliedstudent.feedback;
    //     this.studentList[index].reviewed = repliedstudent.reviewed;
    //
    //     this.tempStudentList[index].grade = repliedstudent.grade;
    //     this.tempStudentList[index].answer_id = repliedstudent._id;
    //     this.tempStudentList[index].feedback = repliedstudent.feedback;
    //   }
    // });
  }

  public saveChartInstance(chartInstance) {
    this.chart = chartInstance;
  }

  public trackByFn(index) {
    return index;
  }

}
