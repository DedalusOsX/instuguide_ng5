import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'objective',
  templateUrl: 'objectives.component.html',
})
export class ObjectiveComponent implements OnInit {
  @Input() public material: any;

  public circleBarOptions: any;

  // public material: any;

  constructor() {
    // constructor
  }

  public ngOnInit() {
    this.circleBarOptions = {
      calcField: 'status',
      suffix: '%'
    };
    // this.material = {
    //                 name: 'objectives',
    //                 type: 'objectives',
    //                 values: [
    //                 {
    //                     id: 1,
    //                     name: 'First law of Newton',
    //                     todos: [
    //                         {
    //                             type: 'lesson',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 1
    //                             }, {
    //                                 id: 3,
    //                                 status: 1
    //                             }, {
    //                                 id: 4,
    //                                 status: 1
    //                             }, {
    //                                 id: 5,
    //                                 status: 1
    //                             }],
    //                             checked: false
    //                         },
    //                         {
    //                             type: 'assignement',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 1
    //                             }, {
    //                                 id: 2,
    //                                 status: 1
    //                             }],
    //                             checked: false
    //                         },{
    //                             type: 'midterm',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 1
    //                             }, {
    //                                 id: 2,
    //                                 status: 0
    //                             }],
    //                             checked: false
    //                         },
    //                     ]
    //                 },{
    //                     id: 2,
    //                     name: 'Second law of Newton',
    //                     todos: [
    //                         {
    //                             type: 'lesson',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 1
    //                             }, {
    //                                 id: 3,
    //                                 status: 0
    //                             }],
    //                             checked: false
    //                         },
    //                         {
    //                             type: 'test',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 1
    //                             }, {
    //                                 id: 5,
    //                                 status: 1
    //                             }],
    //                             checked: false
    //                         },{
    //                             type: 'tutorial',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 0
    //                             }, {
    //                                 id: 5,
    //                                 status: 0
    //                             }],
    //                             checked: false
    //                         },
    //                     ]
    //                 },{
    //                     id: 3,
    //                     name: 'Third law of Newton',
    //                     todos: [
    //                         {
    //                             type: 'test',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 1
    //                             }, {
    //                                 id: 3,
    //                                 status: 1
    //                             }],
    //                             checked: false
    //                         },
    //                         {
    //                             type: 'assignement',
    //                             value: [{
    //                                 id: 1,
    //                                 status: 0
    //                             }, {
    //                                 id: 5,
    //                                 status: 1
    //                             }],
    //                             checked: false
    //                         },
    //                     ]
    //                 }]
    //             }
  }
}
