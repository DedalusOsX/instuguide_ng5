import { UnitRest } from './unit-rest.model';
import { List } from 'immutable';

export const Material_Types = List([
  {label: 'Lecture', field: 'lecture', category: 'material_types'},
  {label: 'Lesson', field: 'lesson', category: 'material_types'},
  {label: 'Class', field: 'class', category: 'material_types'},

  {label: 'Practice', field: 'practice', category: 'practice_types'},
  // {label: 'Lab', field: 'lab', category: 'practice_types'},

  {label: 'Assignment', field: 'assignment', category: 'activity_types'},
  {label: 'Tutorial', field: 'tutorial', category: 'activity_types'},
  // {label: 'Project', field: 'project', category: 'activity_types'},

  {label: 'Final exam', field: 'final_exam', category: 'test_types'},
  {label: 'Midterm', field: 'midterm', category: 'test_types'},
  {label: 'Test', field: 'test', category: 'test_types'},
  // {label: 'Objectives', field: 'objectives', category: 'test_types'},
]);

export class Unit extends UnitRest {
  public _isProcessed?: boolean;
}
