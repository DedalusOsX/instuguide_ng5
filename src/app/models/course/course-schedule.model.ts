import { Material_Types } from '../unit/unit.model';
import * as _ from 'lodash';

export interface ICourseStateType {
  eventType: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  location: string;
}

export class CoursesSchedule {

  public activeType: string;
  public courses: ICourseStateType[];
  public courseTypes = Material_Types.toArray();

  private _schedule: ICourseStateType = <ICourseStateType> {
    eventType: '',
    weekDay: '',
    startTime: '',
    endTime: '',
    location: ''
  };

  constructor(schedules: any[]) {
    this.courses = [];
    if (schedules) {
      let materialTypes = Material_Types.toArray();
      let schedule = Object.assign({}, this._schedule);

      schedules.forEach(item => {
        schedule.eventType = _.first(materialTypes.filter(o => o.field === item.type)).label;
        schedule.weekDay = item.week_days;
        schedule.startTime = item.start_time;
        schedule.endTime = item.end_time;
        schedule.location = item.location;

        this.add(schedule);
      });
    } else {
      this.add();
    }
  }

  public setActive(type: string) {
    this.activeType = type;
  }

  public add(schedule: ICourseStateType = Object.assign({}, this._schedule)) {
    this.courses.push(schedule);
  }

  public remove(index) {
    this.courses.splice(index, 1);
  }

  public setValue(index: number, prop: string, value: any) {
    this.courses[index][prop] = value;
  }

}
