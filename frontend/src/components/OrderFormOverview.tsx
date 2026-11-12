import React, { useState } from "react";
import styles from "./styles/OrderFormOverview.module.css";
import type { NewOrder_a } from "../types/Order";
import BasicSelect from "./Select";

export default function OrderFormOverview({
  fields,
  fieldError,
  order,
  partiesOptions,
  statusesOptions,
  poTypesOptions,
  handleChange,
  formatDate,
}: {
  fields: Array<{
    name: string;
    type: string;
    key: string;
    required?: boolean;
  }>;
  fieldError: boolean;
  order: NewOrder_a;
  partiesOptions: Array<{ id: number; value: string }>;
  poTypesOptions: Array<{ id: number; value: string }>;
  statusesOptions: Array<{ id: number; value: string }>;
  handleChange: (value) => void;
  formatDate: (val: any) => string;
}) {
  const selectedOptionInitialState = { id: "", value: "" };

  const [selectedParty, setSelectedParty] = useState(
    selectedOptionInitialState,
  );
  const [selectedStatus, setSelectedStatus] = useState(
    selectedOptionInitialState,
  );
  const [selectedPoType, setSelectedPoType] = useState({ id: 1, value: "" });

  function handlePoTypeOptionChange(po_type_id: number) {
    handleChange((prev) => {
      return { ...prev, po_type_id };
    });
    setSelectedPoType(poTypesOptions.filter((p) => p.id === po_type_id)[0]);
  }
  function handleStatusOptionChange(status_id: number) {
    handleChange((prev) => {
      return { ...prev, status_id };
    });
    setSelectedStatus(statusesOptions.filter((s) => s.id === status_id)[0]);
  }

  function handlePartyOptionChange(party_id: number) {
    handleChange((prev) => {
      return { ...prev, party_id };
    });
    setSelectedParty(partiesOptions.filter((p) => p.id === party_id)[0]);
  }

  return (
    <div
      style={{ gridTemplateRows: `repeat(${fields.length + 1},auto)` }}
      className={styles.overviewDetails}
    >
      {fields.map((field, fieldIdx) => {
        const { type, name, key } = field;
        let selectedOption = {},
          options = [],
          handleOptionChangeFn = (_: number) => {};
        if (key == "party") {
          selectedOption = selectedParty;
          options = partiesOptions;
          handleOptionChangeFn = handlePartyOptionChange;
        } else if (key == "status") {
          selectedOption = selectedStatus;
          options = statusesOptions;
          handleOptionChangeFn = handleStatusOptionChange;
        } else if (key == "po_type") {
          selectedOption = selectedPoType;
          options = poTypesOptions;
          handleOptionChangeFn = handlePoTypeOptionChange;
        }

        return (
          <React.Fragment key={fieldIdx}>
            <p key={key + "p"} className={styles.keyOne}>
              {name}
              <span className="text-red-600">{field?.required && "*"}</span>
            </p>
            <p>:</p>
            {type === "select" ? (
              <BasicSelect
                className={styles.valueOne}
                key={fieldIdx}
                options={options}
                selectedOption={selectedOption}
                handleOptionChange={handleOptionChangeFn}
                required={fieldError && field?.required && !selectedOption.id}
              />
            ) : (
              <input
                key={fieldIdx}
                className={styles.valueOne}
                style={
                  fieldError && field?.required && !order[key]
                    ? {
                        border: "1px solid red",
                      }
                    : {}
                }
                {...(type == "number" && { min: 0 })}
                type={type}
                value={type == "date" ? formatDate(order[key]) : order[key]}
                name={key}
                placeholder={name}
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
