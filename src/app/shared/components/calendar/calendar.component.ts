import { ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, Component, OnInit, OnChanges, Input, Output} from '@angular/core';
import { ScheduleEvent } from './calendar.model';

@Component({
  selector: 'ical',
  templateUrl: 'calendar.component.html'
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() public type: string = 'schedule';
  @Input() public events: ScheduleEvent[] = [];
  @Input() public weekStartTime: number = 8;
  @Input() public weekEndTime: number = 20;

  public hours: any = [];
  public weekdays: string[];
  constructor(private cd: ChangeDetectorRef) {
  }

  public ngOnInit(){
    this.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  public ngOnChanges(changes: SimpleChanges){
    if (changes.events) {
      this._initCalendar();
    }
  }

  public _initCalendar(){
    let start = 0;
    let end = 0;
    let minStart = 8;
    let maxEnd = 0;
    this.hours.length = 0;
    this.events.forEach((item) => {
      start = Math.floor(item.start_time / 60);
      end = Math.ceil(item.end_time / 60);
      if (start < minStart) {
        minStart = start;
      }
      if (end > maxEnd) {
        maxEnd = end;
      }
    });
    this.weekStartTime = minStart;
    if(minStart + 8 > maxEnd){
      this.weekEndTime = minStart + 8;
    } else {
      this.weekEndTime = maxEnd;
    }
    let hour = '';
    for (let i = this.weekStartTime; i <= this.weekEndTime; i++) {
      hour = this._transform24To12(i * 60);
      this.hours.push(hour);
    }
    this.cd.markForCheck();
  }

  public _transform24To12(totalMinutes: number){
    let time = '';
    let dayTime = '';
    let hour12 = 0;
    let hour24 = Math.floor(totalMinutes / 60);
    let minutes: string | number = totalMinutes % 60;
    minutes = (minutes < 10) ? ("0" + minutes) : minutes;

    if (hour24 < 12) {
      hour12 = hour24;
      dayTime = 'am';
    }
    else {
      if (hour24 == 12) {
        hour12 = hour24;
        dayTime = 'pm';
      } else if (hour24 == 24) {
        hour12 = hour24 - 12;
        dayTime = 'am';
      } else {
        hour12 = hour24 - 12;
        dayTime = 'pm';
      }
    }

    time = `${hour12}:${minutes}${dayTime}`;
    return time;
  }
}
