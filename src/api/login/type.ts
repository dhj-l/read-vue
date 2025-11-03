export interface GetCodeParams {
  email: string;
}
export interface LoginParams {
  username: string;
  password: string;
}
export interface RegisterParams extends LoginParams {
  email: string;
  code: string;
}
export interface LoginResponse {
  access_token: string;
}
