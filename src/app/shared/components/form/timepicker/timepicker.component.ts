import {
  Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/*----------  Defining Time Picker Class/Prototype  ----------*/

export class TimePicker {
  public hour: string;
  public minute: string;
  public daytime: string;

  constructor(hour?, minute?, daytime?) {
    this.hour = hour;
    this.minute = minute;
    this.daytime = daytime;
  }

  get formattedTime() {
    let time = '';
    if (this.isValid()) {
      time = `${this.hour}:${this.minute} ${this.daytime}`;
    }
    return time;
  };

  public isValid() {
    return this.hour && this.minute && this.daytime;
  }
}

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html'
})

/*----------  Defining This Comonent  ----------*/
export class TimepickerComponent implements OnInit, OnChanges {

  @Input() public label: string;
  @Input() public helperText: string;
  @Input() public options: any;
  @Input() public value: number;
  @Output() public valueUpdated = new EventEmitter();

  public opened: boolean = false;
  public selected: TimePicker = new TimePicker();
  public times: any;

  private _clickEvent: string = 'click';
  private defaultOptions: any = {
    _disableFrom: '',
    get disableFrom() {
      return this._disableFrom;
    },
    set disableFrom(minutes) {
      if (!minutes || isNaN(+minutes) || !(minutes instanceof Number)) {
        throw new Error('disableFrom property need to be valid Number/minutes');
      }
      this._disableFrom = minutes;
    }
  };

  private referanceTime: any = {
    hour: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    minute: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    daytime: ['am', 'pm']
  };

  constructor(private el: ElementRef, @Inject(DOCUMENT) private document: any) {
    if (!this.options) {
      this.options = {};
    }
    this.options = Object.assign(this.options, this.defaultOptions);
  }

  public ngOnInit() {
    this._initCloseListeners();
    this.initModel();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.selected = this.fromMinutes(changes.value.currentValue);
    }
  }

  public setValue(type, direction) {
    let currentRef = this.referanceTime[type];
    let base = this.selected[type];
    if (direction === true) {
      for (let i = 0; i < currentRef.length; i++) {
        if (base === currentRef[i]) {
          if (i === currentRef.length - 1) {
            this.selected[type] = currentRef[0];
            return;
          } else {
            this.selected[type] = currentRef[i + 1];
            return;
          }
        }
      }
      this.selected[type] = currentRef[0];
    } else {
      for (let j = 0; j < currentRef.length; j++) {
        if (base === currentRef[j]) {
          if (j === 0) {
            this.selected[type] = currentRef[currentRef.length - 1];
            return;
          } else {
            this.selected[type] = currentRef[j - 1];
            return;
          }
        }
      }
      this.selected[type] = currentRef[0];
    }
  }

  public initTimepicker(): void {
    this.opened = true;
    if (!this.selected.isValid()) {
      this.selected = new TimePicker('12', '00', 'pm');
    }
    this.initModel();
    // if (this.options.disableFrom) {
    //     let times = this.timeFromMinutes(this.options.disableFrom);
    //     this.times.hours = this._times.hours.filter(hour => {
    //         if (parseInt(hour) > parseInt(times.hour)) return hour;
    //     });
    // }
  }

  public onBlur(): void {
    if (this.selected.isValid() && this.opened === true) {
      this.opened = false;
      let timeInMinutes = this.asMinutes(this.selected.daytime, this.selected.hour, this.selected.minute);
      this.valueUpdated.emit(timeInMinutes);
    }
  }

  /**
   * Initializes event handlers for the closeOnClickOutside and keyClose options.
   */
  private _initCloseListeners(): void {
    setTimeout(() => {
      this.document.addEventListener(this._clickEvent, (e) => {
        if (!this.el.nativeElement.contains(e.target)) {
          this.onBlur();
        }
      });
    });
  }

  private asMinutes(daytime, hour, minute): number {
    return (parseInt(hour === '12' ? '00' : hour, 10) + (daytime === 'am' ? 0 : 12)) * 60 + parseInt(minute, 10);
  }

  private fromMinutes(minutes: number): TimePicker {
    let h: any = Math.floor(minutes / 60);
    let m: any = Math.floor(minutes % 60);
    let dayTime = 'am';
    if (h >= 12) {
      h =  Math.abs(h - 12);
      dayTime = 'pm';
    }
    if (h < 10) {
      h = '0' + h;
    }
    if (m < 10) {
      m = '0' + m;
    }
    return new TimePicker(h, m, dayTime);
    // return (parseInt(hour === '12' ? '00' : hour, 10) + (daytime === 'am' ? 0 : 12)) * 60 + parseInt(minute, 10);
  }

  private initModel(): void {
    let timeModel = this.options.disableFrom;

    if (timeModel) {
      this.selected.daytime = (timeModel / 60 < 12) ? 'am' : 'pm';
      let x = this.selected.daytime === 'am' ? 0 : 720;
      let y = Math.floor((timeModel - x) / 60) < 10 ? '0' + Math.floor((timeModel - x) / 60).toString() : Math.floor((timeModel - x) / 60).toString();
      this.selected.hour = (timeModel - x) / 60 === 0 ? '12' : y;
      this.selected.minute = timeModel % 60 < 10 ? '0' + (timeModel % 60).toString() : (timeModel % 60).toString();
    }

    if (this.options.disableFrom) {
      timeModel = this.options.disableFrom + 60;
    }

    // if (this.options.disableFrom) {
    // timeModel = this.options.disableFrom + 60;
    // }
  }
}
