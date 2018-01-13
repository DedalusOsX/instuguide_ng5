import { CoursesSchedule } from './course-schedule.model';

export interface IUnitTypes {
  material_types: string[];
  practice_types: string[];
  activity_types: string[];
  test_types: string[];
}

export class Course {
  public id?: string;
  public category: string;
  public description: string;
  public syllabus?: any;
  public end_date: string;
  public name: string;
  public price?: number;
  public schedule?: CoursesSchedule[];
  public start_date: string;
  public type: string;
  public unit_available_types: string[];
  public minimum_pass_grade: number;
  public expecting_grade: number;
  public structure_type: string;
}
