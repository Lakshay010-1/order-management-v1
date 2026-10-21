import type { Status } from "../types/Status";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const STATUSES_API_LINK = API_LINK + "/statuses";

const getStatuses: () => Promise<Array<Status>> = async () => {
  return getMethodCall<Array<Status>>(STATUSES_API_LINK);
};

const deleteStatus: (id: number) => Promise<boolean> = async (id) => {
  return await deleteMethodCall(STATUSES_API_LINK + `/${id}`);
};
const putStatus: (id: number, status: string) => Promise<boolean> = async (
  id,
  status,
) => {
  return await putMethodCall(STATUSES_API_LINK + `/${id}`, { status });
};
const addStatus: (statusVal: string) => Promise<Status> = async (status) => {
  return await postMethodCall<Status>(STATUSES_API_LINK, { status });
};

export { getStatuses, deleteStatus, putStatus, addStatus };
