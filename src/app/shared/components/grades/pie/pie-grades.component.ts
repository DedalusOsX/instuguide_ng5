import { Component, DoCheck, EventEmitter, Input, IterableDiffers, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pie-grades',
  templateUrl: './pie-grades.component.html'
})

export class PieGradesComponent implements OnInit, DoCheck {

  @Input('title') public title: string;
  @Input('colorScheme') public colorScheme: string;
  @Input('gradeWeights') public gradeWeights: any[];

  @Output() public valueUpdated = new EventEmitter();

  public gradeWeightsChartOptions: any;
  public chart: any;
  public legendColor: string[] = [];
  public iterableDiffer: any;

  constructor(private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  public ngOnInit() {
    this.legendColor.push(this.colorScheme === 'dark' ? '#ffffff' : '#333333', '#1ecd97');
    this.gradeWeightsChartOptions = {
      chart: {
        backgroundColor: 'transparent',
        marginTop: 50,
        zoomType: 'x'
      },
      exporting: {
        buttons: { contextButton: { enabled: false } }
      },
      credits: { enabled: false },
      rangeSelector: { enabled: false },
      navigator: { enabled: false },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        enabled: true,
        itemStyle: {
          color: this.legendColor[0]
        },
        itemHoverStyle: {
          color: this.legendColor[1]
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          dataLabels: { enabled: false }
        }
      },
      scrollbar: { enabled: false },
      series: [{
        type: 'pie',
        name: 'GPA progress',
        colorByPoint: true,
        showInLegend: true,
        data: this.transformGWForChart()
      }],
      tooltip: {
        pointFormat: '{series.type}: <b>{point.value:.1f}%</b>'
      }
    };
  }

  /**
   * Detect gradeweight change from outside
   */
  public ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.gradeWeights);
    if (changes) {
      this.gradeWeights.forEach((grade: any, index: number) => this.onChangeWeightVal(index, grade.value));
      this.ngOnInit();
    }
  }

  public saveChartInstance(chartInstance) {
    this.chart = chartInstance;
  }

  public totalUsedWeight() {
    return this.gradeWeights.sum('value');
  }

  public onChangeWeightVal(index, value) {
    value = +value;
    let weight = this.gradeWeights[index];
    let errorContainer = <HTMLElement> document.querySelector('.error-helper');
    weight.value = value;
    if (100 - this.totalUsedWeight() < 0) {
      errorContainer.style.display = 'block';
    } else {
      errorContainer.style.display = 'none';
      this.chart.series[0].setData(this.transformGWForChart(), true);
      this.valueUpdated.emit(this.gradeWeights);
    }
  }

  private transformGWForChart(): any[] {
    let exportedArr = [];
    let usedWeight = this.totalUsedWeight();

    this.gradeWeights.forEach(item => {
      item.value = +item.value;
      exportedArr.push([item.name, item.value]);
    });

    let unusedWeight = 100 - usedWeight;
    let unusedSlice = {
      name: 'Remaining Weight',
      y: unusedWeight,
      color: '#B0B2B4'
    };
    exportedArr.push(unusedSlice);

    return exportedArr;
  }
}
