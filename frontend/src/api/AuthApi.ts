import { AUTH_LINK } from "./URLs";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";

const loginUser: (
  username: string,
  password: string,
) => Promise<boolean> = async (username, password) => {
  return postMethodCall(`${AUTH_LINK}/login`, { username, password });
};

const logoutUser: () => Promise<boolean> = async () => {
  return postMethodCall(`${AUTH_LINK}/logout`, {});
};

const checkUser: () => Promise<{ username: string }> = async () => {
  return getMethodCall<{ username: string }>(`${AUTH_LINK}/me`);
};

export { loginUser, logoutUser, checkUser };
