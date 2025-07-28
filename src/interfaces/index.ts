export interface IMessage {
  role: string;
  content: string;
  isNewMessage?: boolean;
}

export interface IResponseTeacher {
  message: string;
  token: number;
}


export interface IUser {
  id?: number;
  google_id?: string;
  name?: string;
  email: string;
  picture?: string;
  first_connection?: boolean;
  niveau_language?: string;
}