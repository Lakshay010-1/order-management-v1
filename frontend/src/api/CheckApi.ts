import { BASE_LINK } from "./URLs";

const isApiUp: () => Promise<boolean> = async () => {
  const response = await fetch(`${BASE_LINK}`);
  return response.ok;
};

export { isApiUp };
