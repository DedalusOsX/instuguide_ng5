import { NgModule } from '@angular/core';

import { AddCommasPipe } from './add-commas';
import { GroupByPipe } from './group-by.pipe';
import { FileSizePipe } from './file-size.pipe';

export const PIPES = [
  AddCommasPipe,
  GroupByPipe,
  FileSizePipe
];

@NgModule({
  declarations: PIPES,
  exports: PIPES
})
export class PipesModule {
}
