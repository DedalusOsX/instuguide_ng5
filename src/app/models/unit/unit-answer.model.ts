export class AnswerModel {
  public _id?: string;
  public course_id: string;
  public material_id: string;
  public student_id: string;
  public teacher_id: string;
  public unit_id: string;
  public status: string;
  public type: string;
  public content: any[] = [];
  public reviewed?: any[];
  public grade: any;
  public gpa_delta?: any;
  public weight: number;
}

export class AnswerRestModel extends AnswerModel{
  public deleted_content?: any[] = [];
}
