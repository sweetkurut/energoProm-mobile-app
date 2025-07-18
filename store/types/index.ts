// это для регситрации
export interface ISignUpEmail {
  email: string;
}

export interface ISignUpEmailResponse {
  id: string;
  email: string;
}

export interface IVerifyCode {
  email: string;
  verification_code: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  id: number;
  email: string;
  refresh: string;
  access: string;
}

export interface ISetPassword {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface ISetPasswordResponse {
  status: number;
  id: number;
  name: string;
  user: string;
  refresh: string;
  access: string;
}

export interface IRefreshTokenResponse {
  refresh: string;
  access: string;
}
export interface IResetPassword {
  email: string;
  code: string;
  new_password: string;
}

// тут короче профиль
export interface IProfile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  registered_at: string;
  updated_at: string;
}

export interface IProfileUpdate {
  name: string;
  email: string;
  avatar: string;
}

export interface IProfileUpdatePassword {
  old_password: string;
  new_password: string;
}
