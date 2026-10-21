export const deleteMethodCall: (
  api_link: string,
) => Promise<boolean> = async (api_link) => {
  const response = await fetch(api_link, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return true;
};
