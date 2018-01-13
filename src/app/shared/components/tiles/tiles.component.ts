import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TileInterface } from '../../../shared/interfaces/tile.interface';

@Component({
  selector: 'tiles',
  templateUrl: 'tiles.component.html'
})

export class TilesComponent implements OnInit {
  @Input() public tiles: TileInterface[] = [];
  @Output() public onSetTile = new EventEmitter<number>();

  public activeTile: number = 0;

  constructor() {
  }

  public ngOnInit() {
    this.onSetTile.emit(0);
  }

  public setActive(index): void {
    this.activeTile = index;
    this.tiles[index].notification = 0;
    this.onSetTile.emit(index);
  }
}
