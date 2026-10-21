export const getMethodCall = async <T>(api_link: string): Promise<T> => {
  const response = await fetch(api_link, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data as T;
};
