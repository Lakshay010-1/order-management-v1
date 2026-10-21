export const putMethodCall: (
  api_link: string,
  body: object,
) => Promise<boolean> = async (api_link, bodyData) => {
  const response = await fetch(api_link, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return true;
};
  