export interface Result {
  message: string;
}

export interface LoginInput {
  info: string;
  password: string;
}

export interface BaseInput<T> {
  input: T;
}

export interface ChatMsgInput {
  groupId: string;
  type: string;
  msg: string;
}

export interface ChatMsg {
  msg: string;
  type: string;
  senderId: string;
}

export interface TagInfo {
  tagId: string
  name: string
}

export interface CourseInfo {
  courseId: string
  liveId: string
  timeOpen: string
  timeClose: string
  state: number
  cover: string
  title: string
  description: string
  organize: string
  coursewares: [CoursewareInfo]
  comments: [CommentInfo]
  teachers: [UserInfo]
  assistants: [UserInfo]
  students: [UserInfo]
  tags: [TagInfo]
  teach: boolean
  joined: boolean
  userCount: number
  sentiGood: number
  sentiAvg: number
}

export interface CommentInfo {
  commentId: string
  user: UserInfo
  details: string
  timeCreate: string
  timeModified: string
  replyTo: string
}

export interface CoursewareInfo {
  coursewareId: string
  name: string
  type: number
  timeCreate: string
  timeModified: string
  thumbsnail: string
}

export interface CourseChangeInput {
  type: string
  userIds: string[]
  courseId: string
}

export interface RegisterInput {
  name: string;
  password: string;
  majorId: string;
  mail: string;
}

export interface CommentInput {
  commentId?: String
  details?: String
  courseId?: String
  replyTo?: String
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
  disable?: boolean;
}

export interface GroupInfo {
  groupId: string;
  name: string;
  users: UserInfo[];
}

export interface AuthInfo {
  userId: string;
  role: number;
}

export interface GroupChatMsg {
  groupId: string
  msgs: ChatMsg[]
}

export interface ScoreInput {
  courseId: String
  score: Number
}

// Query Results
export type UserInfoResult = { user: UserInfo };
export type ManyUserInfoResult = { users: UserInfo[] };

export type DepartmentInfoResult = { department: DepartmentInfo };
export type ManyDepartmentInfoResult = { departments: DepartmentInfo[] };

export type GroupChatMsgResult = { chat: GroupChatMsg };
export type ManyGroupInfoResult = { groups: GroupInfo[] };

export type CourseInfoResult = { course: CourseInfo };
export type ManyCourseInfoResult = { courses: CourseInfo[] };

export type ManyCommentInfoResult = { comments: CommentInfo[] };


// Mutation Results
export type LoginResult = { login: AuthInfo };
export type RegisterResult = { register: AuthInfo };
export type LogoutResult = { logout: Result };
export type SendMsgResult = { sendMsg: Result };
export type ScoreResult = { score: Result };
