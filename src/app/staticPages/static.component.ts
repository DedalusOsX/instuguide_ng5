import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'static',
  templateUrl: './static.pages.component.html'
})

export class StaticPagesComponent {

  public page: string;

  constructor(private route: ActivatedRoute) {
    // this.page = this.route.snapshot.data['page'];
  }

}
