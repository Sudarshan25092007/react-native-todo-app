import { Task } from "./task";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
  TaskForm: { task?: Task };
};

