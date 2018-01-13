export declare class ErrorModel {
  public success: boolean;
  public status: number;
  public errors: Array<{
    type: string,
    message: string,
    params: any
  }>;
}
