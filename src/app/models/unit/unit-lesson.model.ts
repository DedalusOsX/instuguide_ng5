export class LessonModel {
  public id?: string;
  public index: number;
  public media: any[] = [];
  public deleted_media: any[] = [];
  public media_links: string[] = [];
  public name: string = '';
  public note: string = '';
  public status: string = 'locked';
  public type: string;
}
