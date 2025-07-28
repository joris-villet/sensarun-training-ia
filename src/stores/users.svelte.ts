import type { IUser } from "../interfaces";

export const storeUser = $state<IUser>({
  name: "",
  email: "",
  picture: "",
  first_connection: false,
  niveau_language: "",
})