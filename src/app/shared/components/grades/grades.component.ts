import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'grades',
  templateUrl: './grades.component.html'
})
export class GradesComponent implements OnInit {
  @Input() public theme: string;
  @Input() public series: any;
  @Input() public chartStyle: string;

  public gradeFilterLegendLabels: any[] = [];
  public allMarks: any = {label: 'All', checked: true};
  public filterRange: string[] = ['all', 'year', 'month', 'week'];
  public currentFilterRange: string = 'all';
  public legendLabels: any[] = [];
  public options: any;
  public chart: any;
  public mainColor: string;

  private formattedSeries: any[] = [];

  constructor() {
    //  Constructor
  }

  public ngOnInit() {
    this.mainColor = this.theme === 'dark' ? '#ffffff' : '#394041';
    if (!this.series || !this.series.length) {
      console.log('Series is empty');
    }
    if (this.chartStyle === 'areaColumn') {
      this.prepareAreaColumn();
    } else {
      this.prepareChart();
    }

    this.gradeFilterLegendLabels.push({
      checked: true,
      index: 0,
      label: 'All Marks'
    });
    this._initChart();
  }

  public saveInstance(chartInstance) {
    this.chart = chartInstance;
  }

  public prepareAreaColumn() {
    this.series.forEach((point: any[]) => {
      const labelObj = {
        label: point[2],
        checked: true
      };
      if (!this.legendLabels.find(item => item.label === labelObj.label)) {
        this.legendLabels.push(labelObj);
      }
    });
    this.legendLabels.forEach((legend: any) => {
      let series = this.series.filter(coke => coke[2] === legend.label);
      let ln: any;
      if (legend.label === 'GPA') {
        ln = this.formattedSeries.push({
          name: legend.label,
          type: 'areaspline',
          color: '#1ecd97',
          marker: {
            enabled: true,
            radius: 5,
          },
          data: []
        });
      } else {
        ln = this.formattedSeries.push({
          name: legend.label,
          type: 'column',
          color: this.mainColor,
          data: []
        });
      }
      series.forEach((serie: any[]) => {
        this.formattedSeries[ln - 1].data.push({
          x: serie[0],
          y: serie[1],
          name: serie[2] + ' ' + serie[3]
        });
      });
    });
    this.legendLabels.forEach((legend: any) => {
      this.formattedSeries.forEach((item: any, index: number) => {
        if (legend.label == item.name) {
          legend.index = index;
        }
      });
      this.gradeFilterLegendLabels.push(legend);
    });
  }

  public prepareChart() {
    this.series.forEach((item: any, index: number) => {
      if (item.data.length) {
        this.legendLabels.push({
          label: item.name,
          checked: true
        });
        let ln = this.formattedSeries.push({
          name: item.name,
          type: this.chartStyle,
          data: [],
          marker: {
            enabled: true,
            radius: 5,
          }
        });
        item.data.forEach((point) => {
          this.formattedSeries[ln - 1].data.push({
            x: point[0],
            y: point[1],
            name: point[2] + ' ' + point[3]
          });
        });
      }
    });
    this.legendLabels.forEach(legend => {
      this.series.forEach((item, index) => {
        if (legend.label == item.name) {
          legend.index = index;
          this.gradeFilterLegendLabels.push(legend);
        }
      });
    });
  }

  public filter(period: string): void {
    this.currentFilterRange = period;
    let max = this.chart.xAxis[0].getExtremes().max;
    switch (period) {
      case 'week':
        this.chart.xAxis[0].setExtremes((max - 7 * 24 * 3600 * 1000), max);
        break;
      case 'month':
        let format = new Date(max);
        let d = new Date(format.getFullYear(), format.getMonth() + 1, 0).getDate();
        this.chart.xAxis[0].setExtremes((max - d * 24 * 3600 * 1000), max);
        break;
      case 'year':
        this.chart.xAxis[0].setExtremes((max - 200 * 24 * 3600 * 1000), max);
        break;
      case 'all':
        this.chart.xAxis[0].setExtremes(null, null);
        break;
      default:
        break;
    }
    this.chart.container.style.width = '100%';
  }

  public filterLegend(index?: number): void {
    if (index === void 0) {
      for (let i = 1; i < this.gradeFilterLegendLabels.length; i++) {
        this.gradeFilterLegendLabels[i].checked = this.gradeFilterLegendLabels[0].checked;
      }
      for (let i = 0; i < this.chart.series.length; i++) {
        this.gradeFilterLegendLabels[0].checked ? this.chart.series[i].show() : this.chart.series[i].hide();
      }
    } else {
      let grade = this.gradeFilterLegendLabels[index];
      this.formattedSeries.forEach((item) => {
        if (item.name == grade.label) {
          this.chart.series[grade.index].setVisible(grade.checked);
        }
      });
      //  check all status for unmark/mark all Marks
      let isAllMarked = this.gradeFilterLegendLabels.every(item => item.checked == grade.checked);
      if (isAllMarked) {
        this.allMarks.checked = grade.checked;
      }
    }
  }

  public prev(): boolean | void {
    let min = this.chart.xAxis[0].getExtremes().min,
      dmin = this.chart.xAxis[0].getExtremes().dataMin,
      max = this.chart.xAxis[0].getExtremes().max,
      range = max - min;

    if (min > dmin) {
      this.chart.xAxis[0].setExtremes((min - range), min);
    } else {
      return false;
    }
  }

  public next(): boolean | void {
    let min = this.chart.xAxis[0].getExtremes().min,
      dmax = this.chart.xAxis[0].getExtremes().dataMax,
      max = this.chart.xAxis[0].getExtremes().max,
      range = max - min;

    if (max < dmax) {
      this.chart.xAxis[0].setExtremes(max, (max + range));
    } else {
      return false;
    }
  }

  private _initChart(): void {
    this.options = {
      chart: {
        backgroundColor: 'transparent',
        marginTop: 50,
        zoomType: 'x'
      },
      colors: ['#1ecd97', '#FAC63F', '#4d9de0', '#ff3f46', '#00BCF9', '#515151', '#fff'],
      exporting: {
        buttons: {contextButton: {enabled: false}}
      },
      credits: {enabled: false},
      rangeSelector: {enabled: false},
      navigator: {enabled: false},
      scrollbar: {enabled: false},
      series: this.formattedSeries,
      yAxis: {
        gridLineWidth: 0,
        lineWidth: 2,
        gridLineColor: this.mainColor,
        lineColor: this.mainColor,
        max: 100,
        ceiling: 100,
        min: 0,
        floor: 0,
        opposite: false,
        tickInterval: 25,
        title: {
          text: 'Grade (%)',
          style: {
            color: this.mainColor
          }
        },
        labels: {
          style: {
            color: this.mainColor
          }
        },
        showLastLabel: true
      },
      xAxis: {
        crosshair: {
          width: 2,
          zIndex: 1
        },
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%b %e',
          week: '%b %e',
          month: '%b %Y',
          year: '%Y'
        },
        title: {
          text: 'Date',
          style: {
            color: this.mainColor
          }
        },
        lineWidth: 2,
        gridLineColor: this.mainColor,
        lineColor: this.mainColor,
        labels: {
          style: {
            color: this.mainColor
          }
        }
      }
    };
  }
}
