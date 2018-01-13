import { Component, Input } from '@angular/core';

@Component({
  selector: 'busy-loader',
  template: `
       <div class="loader" *ngIf="loading">
            <div class="loader__img animated infinite pulse">
                <p>Loading ...</p>
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
        }
        .loader {
            display: block;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            background: rgba(255,255,255, 0.7);
            z-index: 9999;

        }
        .loader__img {
            background: url('/assets/images/logo.svg') no-repeat center center;
            background-size: 100%;
            width: 100px;
            height: 100px;
            left: calc(50% - 50px);
            top: calc(50% - 50px);
            position: absolute;
            z-index: 99999999;
        }
        
        p {
            margin-top: 100px;
            font-size: 18px;
            text-align: center;
            color: #333;
        }
    `]
})

export class BusyLoaderComponent {
  @Input() public loading: boolean;
}
