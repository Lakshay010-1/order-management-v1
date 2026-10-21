import React, { useEffect, useState } from "react";
import styles from "./styles/OverviewGridData.module.css";
import type { Order } from "../types/Order";
import BasicSelect from "./Select";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchParties } from "../store/slices/partySlice";
import { fetchStatuses } from "../store/slices/statusSlice";

interface DataFormat {
  key: string;
  name: string;
}

interface record {
  id: number;
  value: string;
}

const overviewData: Array<DataFormat> = [
  { name: "Party", key: "party" },
  { name: "PO Date", key: "po_date" },
  { name: "Status", key: "status" },
];
export default function OverviewGridData({
  order,
  updateOrder,
  editMode,
  saveMode,
}: {
  order: Order;
  updateOrder: (val: any) => void;
  editMode: boolean;
  saveMode: boolean;
}) {
  const dispatch = useAppDispatch();
  const { parties, initialized: partiesInitialized } = useAppSelector(
    (state) => state.parties,
  );
  const { statuses, initialized: statusesInitialized } = useAppSelector(
    (state) => state.statuses,
  );
  const [partyItems, setPartyItems] = useState<Array<record>>([]);
  const [statusItems, setStatusItems] = useState<Array<record>>([]);

  useEffect(() => {
    if (partiesInitialized) {
      const items = parties.map((party) => {
        return { id: party.id, value: party.party };
      });
      setPartyItems(items);
    } else {
      dispatch(fetchParties());
    }
  }, [parties, partiesInitialized]);

  useEffect(() => {
    if (statusesInitialized) {
      const items = statuses.map((status) => {
        return { id: status.id, value: status.status };
      });
      setStatusItems(items);
    } else {
      dispatch(fetchStatuses());
    }
  }, [statuses, statusesInitialized]);

  function handlePartyOptionChange(id: number) {
    const selectedParty = parties.find((party) => party.id === id);
    updateOrder((prev) => {
      return {
        ...prev,
        party_id: selectedParty!.id,
        party: selectedParty!.party,
      };
    });
  }

  function handleStatusOptionChange(id: number) {
    const selectedStatus = statuses.find((status) => status.id === id);
    updateOrder((prev) => {
      return {
        ...prev,
        status_id: selectedStatus!.id,
        status: selectedStatus!.party,
      };
    });
  }

  return order ? (
    <div
      style={{
        gridTemplateColumns: `repeat(${overviewData.length},auto)`,
      }}
      className={styles.overviewDetails}
    >
      {overviewData.map((data, idx) => {
        const field = data.key as keyof Order;
        const isDate = data.key.toLowerCase().includes("date");
        let value = order[field];
        let inputValue: string;

        if (isDate && value != null && value !== "") {
          const date = new Date(value as string | number | Date);

          inputValue = !Number.isNaN(date.getTime())
            ? date.toISOString().split("T")[0]
            : "";
        } else {
          inputValue = value == null ? "" : String(value);
        }
        return (
          <React.Fragment key={idx}>
            <p className={styles.keyOne} key={data.key + "p"}>
              {data.name}
            </p>
            <p>:</p>
            {data.key == "party" ? (
              <BasicSelect
                options={partyItems}
                selectedOption={{
                  id: order.party_id,
                  value: order.party,
                }}
                handleOptionChange={handlePartyOptionChange}
                isDisabled={!editMode}
              />
            ) : data.key == "status" ? (
              <BasicSelect
                options={statusItems}
                selectedOption={{
                  id: order.status_id,
                  value: order.status,
                }}
                handleOptionChange={handleStatusOptionChange}
                isDisabled={!editMode}
              />
            ) : (
              <input
                className={styles.valueOne}
                disabled={!editMode}
                key={data.key + "input"}
                id={data.key}
                name={data.key}
                type={isDate ? "date" : "text"}
                value={order[data.key]}
                onChange={(e) =>
                  updateOrder((prev) => {
                    return {
                      ...prev,
                      [data.key.toLowerCase()]: e.target.value,
                    };
                  })
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  ) : (
    <h1>No Overview Data Found</h1>
  );
}
