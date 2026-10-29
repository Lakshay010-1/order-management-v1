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
import AlertDialog from "../components/AlertDialog";

export default function Parties() {
  const fields: (keyof Party)[] = [
    "id",
    "party",
    "contact_person",
    "contact_num",
    "contact_email",
  ];
  const [partiesMsg, setPartiesMsg] = useState("");
  const [orderDeleteId, setOrderDeleteId] = React.useState(-1);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTitle, setdialogTitle] = React.useState("");
  const [dialogMsg, setdialogMsg] = React.useState("");
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

  function handleDecision(decision: boolean) {
    if (decision) {
      dispatch(removeParty(orderDeleteId));
    }
    setOpenDialog(false);
  }

  function handleDelete(id: number) {
    setOpenDialog(true);
    setOrderDeleteId(id);
    setdialogMsg(
      `Click \n 'DELETE' to proceed to delete party and all party's associated orders with the party\nOR\n'CANCEL' to cancel the operation`,
    );
    setdialogTitle(`Delete Party:${id}`);
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
    <>
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
      <AlertDialog
        open={openDialog}
        setDecision={handleDecision}
        message={dialogMsg}
        title={dialogTitle}
      />
    </>
  );
}
