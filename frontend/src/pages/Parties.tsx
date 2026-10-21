import React, { useEffect, useState } from "react";
import BasicTable from "../components/ItemsDatatable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchParties,
  insertParty,
  removeParty,
  updateParty,
} from "../store/slices/partySlice";
import Loader from "../components/Loader";
import type { Party } from "../types/Party";
import { setHeaderContent } from "../store/slices/headerSlice";

export default function Parties() {
  const fields: (keyof Party)[] = [
    "id",
    "party",
    "contact_person",
    "contact_num",
    "contact_email",
  ];
  const [partiesMsg, setPartiesMsg] = useState("");
  const {
    parties,
    loading: partiesLoading,
    error: partiesError,
  } = useAppSelector((state) => state.parties);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHeaderContent("Parties"));
  }, []);

  function handleAdd(newPartyData: Party) {
    const validData: Partial<Party> = {};
    for (const field of fields) {
      Object.assign(validData, {
        [field]: newPartyData[field] == "" ? undefined : newPartyData[field],
      });
    }

    dispatch(insertParty(newPartyData));
  }

  function handleUpdate(id: number, updatedData: Party) {
    dispatch(updateParty({ id, details: updatedData }));
    // dispatch();
    // dispatch(partyUpdate({ id, details }));
  }

  function handleDelete(id: number) {
    dispatch(removeParty(id));
    // dispatch(partyDelete(id));
  }

  useEffect(() => {
    if (!partiesLoading) {
      if (partiesError) {
        setPartiesMsg(partiesError);
      } else if (parties.length == 0) {
        setPartiesMsg("Fetching Parties");
        dispatch(fetchParties());
      }
    }
  }, [parties, partiesLoading]);

  return partiesError ? (
    <h1>{partiesError}</h1>
  ) : partiesLoading ? (
    <Loader message={partiesMsg} />
  ) : (
    <BasicTable
      fields={fields}
      data={parties}
      intialState={{
        party: "",
        contact_person: "",
        contact_num: undefined,
        contact_email: "",
      }}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      handleAdd={handleAdd}
    />
  );
}
