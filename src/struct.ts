export interface Result {
  message: string;
}

export interface LoginInput {
  input: {
    info: string;
    password: string;
  };
}

export interface RegisterInput {
  input: {
    name: string;
    password: string;
    majorId: string;
    mail: string;
  };
}

export interface MajorInfo {
  majorId: string;
  name: string;
}

export interface DepartmentInfo {
  departId: string;
  name: string;
  majors: MajorInfo[];
}

export interface UserInfo {
  userId: string;
  name: string;
  avatar: string;
  number: string;
  department: DepartmentInfo;
  major: MajorInfo;
  mail: string;
  role: number;
  motto: string;
  state: number;
  gender: string;
  joinDate: string;
}

export interface AuthInfo {
  userId: string;
  role: number;
}

export type UserInfoResult = { user: { user: UserInfo } & Result };
export type ManyUserInfoResult = { users: { users: UserInfo[] } & Result };

export type DepartmentInfoResult = {
  department: { department: DepartmentInfo } & Result;
};
export type ManyDepartmentInfoResult = {
  departments: { departments: DepartmentInfo[] } & Result;
};

export type LoginResult = { login: AuthInfo & Result };
export type RegisterResult = { register: AuthInfo & Result };
export type LogoutResult = { logout: Result };
