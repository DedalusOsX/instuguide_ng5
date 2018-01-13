export class UserLogin {
  public email: string;
  public password: string;
}

export class UserSignup {
  public email: string;
  public password: string;
  public confirm_password?: string;
  public first_name: string;
  public last_name: string;
  public language: string;
  public role: string;
  public gender: string = 'male';
  public beta_code?: string;
}
