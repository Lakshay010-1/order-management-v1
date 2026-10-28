import React from "react";
import DataTable from "./DataTable";

const hardwareDataKeys = [
  {
    name: "Installation Date",
    key: "hardware_installation_date",
    type: "date",
  },
  {
    name: "Expected Installation Date",
    key: "hardware_installation_expected_date",
    type: "date",
  },
  {
    name: "Installation Status",
    key: "hardware_installation_status",
    type: "select",
  },
];

export default function OrderHardwareTable() {
  return <DataTable fields={hardwareDataKeys} />;
}
