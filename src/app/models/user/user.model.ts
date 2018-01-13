import { CourseRest } from '../course/course-rest.model';

export class User {
  public id: string;
  public avatar: string;
  public background: string;
  public first_name: string;
  public last_name: string;
  public role: string;
  public email: string;
  public position?: string;
  public department?: string;
  public organization?: string;
  public courses: CourseRest[];
  public contacts: any[];
  public bookmarked_courses: CourseRest[];
}
