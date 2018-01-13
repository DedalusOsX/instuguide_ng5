// import { Component, Input, OnInit } from '@angular/core';

// @Component({
//     selector: 'p-circle',
//     templateUrl: 'progress-circle.component.html'
// })

// export class ProgressCircleComponent implements OnInit {
//     @Input() data: any;
//     @Input() options: any;

//     public angle: any = [];
//     public chartOptions: any;
//     public anglePercent: number;

//     ngOnInit() {
//         this._calcPercentAngle();
//         this._initProgressBar();
//     }

//     private _calcPercentAngle(){
//         let completed = 0, total = 0;
//         this.data.forEach(item => {
//             item.value.forEach(item => {
//                 completed += item[this.options.calcField];
//                 total++;
//             });
//         });
//         this.anglePercent = Math.floor(100 * completed / total);
//     }

//     private _initProgressBar() {
//         this.chartOptions = {
//             colors: ['#1ecd97', 'rgba(12,80,59,0.3)'],
//             chart: {
//                 type: 'pie',
//                 backgroundColor: 'transparent',
//                 plotBorderWidth: 0,
//                 plotShadow: false
//             },
//             exporting: {
//                 buttons: { contextButton:{ enabled: false } }
//             },
//             credits: { enabled: false },
//             tooltip: { enabled: false },
//             title: { text: null },
//             plotOptions: {
//                 pie: {
//                     dataLabels: {
//                         enabled: false
//                     },
//                     borderWidth: 0,
//                     enableMouseTracking: false,
//                     startAngle: 0,
//                     center: ['50%', '50%']
//                 }
//             },
//             series: [{
//                 type: 'pie',
//                 name: 'Objective #1 progress',
//                 innerSize: '85%',
//                 data: [
//                     ['Completed',   this.anglePercent],
//                     ['Not Completed',   100 - this.anglePercent],
//                 ]
//             }]
//         }

//     }

// }
