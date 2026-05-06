import { User } from "../user/user.model";

export interface LoginResponeModel {
  token: string;
  user: User;
}