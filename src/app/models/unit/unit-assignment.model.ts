export class AssignmentModel {
  public id?: string;
  public created_at?: string;
  public average_grade: number;
  public media: any[] = [];
  public deleted_media?: any[] = [];
  public solutions?: any[] = [];
  public deleted_solutions?: any[] = [];
  public note: string = '';
  public index: number;
  public weight: number = 0;
  public type: string;
  public status: string = 'locked';
  public start_date?: Date;
  public end_date: Date;
  public start_time?: number;
  public end_time?: number;
  public submit_method: string = 'online';
}
