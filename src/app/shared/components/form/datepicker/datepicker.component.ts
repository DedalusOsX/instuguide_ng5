import {
  Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment/moment';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html'
})

export class DatepickerComponent implements OnInit, OnChanges {

  public static dateWithResetTime(date: Date = new Date()): number {
    return date.setHours(0, 0, 0, 0);
  }

  @Input('model') public dateModel: any;
  @Input() public theme: string;
  @Input() public field: string;
  @Input() public label: string;
  @Input() public helperText: string;
  @Input() public options: any = {};

  @Output() public updatedValue = new EventEmitter();

  public currentDate: any;
  public opened: boolean;
  public selectedDate: Date;
  private _clickEvent: string = 'click';
  private defaultOptions: any = {
    _disableFrom: '',
    get disableFrom() {
      return this._disableFrom;
    },
    set disableFrom(dateValue) {
      if (dateValue instanceof Date) {
        this._disableFrom = new Date(DatepickerComponent.dateWithResetTime(dateValue));
      } else {
        throw Error('disableFrom property need to be valid Date object');
      }
    }
  };

  constructor(private el: ElementRef, @Inject(DOCUMENT) private document: any) {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream && 'ontouchstart' in window) {
      this._clickEvent = 'touchstart';
    }
    this.defaultOptions.disableFrom = new Date();
  }

  public ngOnInit() {
    this.options = Object.assign(this.options, this.defaultOptions);
    this.currentDate = new Date(DatepickerComponent.dateWithResetTime(this.options.disableFrom));
    this.selectedDate =  new Date(this.currentDate);

    this._initCloseListeners();
    if (this.dateModel) {
      this.dateModel = moment(this.dateModel, 'YYYY-MM-DD').toDate();
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.options = Object.assign(changes.options.currentValue, this.defaultOptions);
    }
    if (changes.dateModel) {
      if (changes.dateModel.currentValue && changes.dateModel.previousValue !== changes.dateModel.currentValue) {
        this.dateModel = moment(changes.dateModel.currentValue, 'YYYY-MM-DD').toDate();
        this.selectedDate = moment(changes.dateModel.currentValue, 'YYYY-MM-DD').toDate();
      }
    }
  }

  public changeMonth(orientation) {
    if (orientation > 0) {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    } else {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
    }
    this.calendar();
  }

  public selectDay(day) {
    this.selectedDate = day;
  }

  public confirmDay() {
    this.opened = false;
    this.dateModel = this.selectedDate;
    this.updatedValue.emit(this.dateModel);
  }

  public isSelectedDay(day): boolean {
    if (this.selectedDate) {
      return this.selectedDate.getTime() === day.getTime();
    }
  }

  public initCalendar() {
    this.calendar();
    this.opened = true;
    if (!this.dateModel) {
      // this.dateModel = new Date(DatepickerComponent.dateWithResetTime(this.options.disableFrom));
      // this.updatedValue.emit(this.dateModel);
    }
  }

  public calendar() {
    let disableFrom = new Date(DatepickerComponent.dateWithResetTime(this.options.disableFrom));
    let currentDate = disableFrom || this.currentDate;
    let lastDay = new Date(currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
      , lastDayN = lastDay.getDate()
      , firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
      , firstDayW = firstDay.getDay()
      , lastDayW = lastDay.getDay()
      , prevDays = []
      , nextDays = []
      , allDays = [];

    if (firstDayW != 0) {
      let prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
      for (let k = 0; k < firstDayW; k++) {
        let injectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, prevMonthLastDay - k);
        prevDays.push([injectedDate, 'p']);
      }
    }
    if (lastDayW != 6) {
      for (let k = 0; k < (6 - lastDayW); k++) {
        let injectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, k + 1);
        nextDays.push([injectedDate, 'p']);
      }
    }

    for (let z = 0; z < lastDayN; z++) {
      let injectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), z + 1);
      if (injectedDate.getTime() < disableFrom.getTime()) {
        allDays.push([injectedDate, 'p']);
      } else {
        if (this.options.disableTo && injectedDate.getTime() > this.options.disableTo.getTime()) {
          allDays.push([injectedDate, 'p']);
        } else {
          allDays.push([injectedDate, 'e']);
        }
      }
    }

    prevDays = prevDays.reverse();
    this.currentDate.currentMonth = prevDays.concat(allDays, nextDays);
  }

  public trackByFn(index) { return index; }

  /**
   * Initializes event handlers for the closeOnClickOutside and keyClose options.
   */
  private _initCloseListeners(): void {
    setTimeout(() => {
      this.document.addEventListener(this._clickEvent, (e) => {
        if (!this.el.nativeElement.contains(e.target)) {
          this.opened = false;
        }
      });
    });
  }
}
