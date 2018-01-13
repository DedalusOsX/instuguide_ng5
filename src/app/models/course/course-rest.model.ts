import { User } from '../user/user.model';
import { CoursesScheduleRest } from './course-schedule-rest.model';
import { UnitRest } from '../unit/unit-rest.model';

export class CourseRest {
  public id?: string;
  public avatar: string;
  public books: string[];
  public category: string;
  public created_at: string;
  public created_by: string;
  public description: string;
  public end_date: string;
  public grade_distribution: any;
  public name: string;
  public price: number;
  public code?: string;
  public structure_type: string;
  public minimum_pass_grade?: number | string;
  public expecting_grade?: number | string;
  public schedule: CoursesScheduleRest[];
  public syllabus?: any;
  public skills: string[];
  public start_date: string;
  public subscribers: User[] | string[];
  public type: string;
  public units?: UnitRest[];
  public unit_available_types: string[];
  public used_grades: any;
}
