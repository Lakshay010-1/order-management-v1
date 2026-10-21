import React, { useState } from "react";
import styles from "./styles/OrderFormOverview.module.css";
import type { NewOrder } from "../types/NewOrder";
import BasicSelect from "./Select";

const overviewKeys = [
  { name: "Party", type: "select", key: "party" },
  { name: "PO Date", type: "date", key: "po_date" },
  { name: "Status", type: "select", key: "status" },
];

export default function OrderFormOverview({
  order,
  partiesOptions,
  statusesOption,
  handleChange,
  formatDate,
}: {
  order: NewOrder;
  partiesOptions: Array<{ id: number; value: string }>;
  statusesOption: Array<{ id: number; value: string }>;
  handleChange: (value) => void;
  formatDate: (val: any) => string;
}) {
  const selectedOptionInitialState = { id: -1, value: "" };

  const [selectedParty, setSelectedParty] = useState(
    selectedOptionInitialState,
  );
  const [selectedStatus, setSelectedStatus] = useState(
    selectedOptionInitialState,
  );

  function handleStatusOptionChange(status_id: number) {
    handleChange((prev) => {
      return { ...prev, status_id };
    });
    setSelectedStatus(statusesOption.filter((s) => s.id === status_id)[0]);
  }

  function handlePartyOptionChange(party_id: number) {
    handleChange((prev) => {
      return { ...prev, party_id };
    });
    setSelectedParty(partiesOptions.filter((p) => p.id === party_id)[0]);
  }

  return (
    <div className={styles.overviewDetails}>
      {overviewKeys.map((field, fieldIdx) => {
        const { type, name, key } = field;
        return (
          <React.Fragment key={fieldIdx}>
            <p key={key + "p"} className="keyOne">
              {name}
            </p>
            {type === "select" ? (
              <BasicSelect
                key={fieldIdx}
                options={key == "party" ? partiesOptions : statusesOption}
                selectedOption={key == "party" ? selectedParty : selectedStatus}
                handleOptionChange={
                  key == "party"
                    ? handlePartyOptionChange
                    : handleStatusOptionChange
                }
              />
            ) : (
              <input
                key={fieldIdx}
                type={type}
                value={formatDate(order[key])}
                name={key}
                onChange={(e) =>
                  handleChange((prev) => {
                    return { ...prev, [key]: e.target.value };
                  })
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
