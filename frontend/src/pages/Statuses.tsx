import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchStatuses,
  insertStatus,
  removeStatus,
  updateStatus,
} from "../store/slices/statusSlice";
import BasicTable from "../components/ItemsDatatable";
import type { Status } from "../types/Status";

export default function Statuses() {
  const dispatch = useAppDispatch();
  const { statuses, loading, error } = useAppSelector(
    (state) => state.statuses,
  );
  useEffect(() => {
    (async () => {
      async function fetchData() {
        dispatch(fetchStatuses());
      }
      await fetchData();
    })();
  }, []);

  function handleAdd(newPartyData: Status) {
    dispatch(insertStatus(newPartyData.status));
  }

  function handleUpdate(id: number, updatedData: Status) {
    dispatch(updateStatus({ id, status: updatedData.status }));
  }

  function handleDelete(id: number) {
    dispatch(removeStatus(id));
  }

  return (
    <BasicTable
      fields={["id", "status", "created_at"]}
      data={statuses}
      requiredFields={{ status: true }}
      initialState={{ status: "" }}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      handleAdd={handleAdd}
    />
  );
}
