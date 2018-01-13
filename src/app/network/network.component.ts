import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'network',
  templateUrl: 'network.component.html',
})
export class NetworkComponent {
  constructor(private _router: Router) {
  }
}
