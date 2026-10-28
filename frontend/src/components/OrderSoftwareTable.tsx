import React from "react";
import DataTable from "./DataTable";

const softwareDataKeys = [
  {
    name: "Installation Date",
    key: "software_installation_date",
    type: "date",
  },
  {
    name: "Expected Installation Date",
    key: "software_installation_expected_date",
    type: "date",
  },
  {
    name: "Installation Status",
    key: "software_installation_status",
    type: "select",
  },
];

export default function OrderSoftwareTable() {
  return <DataTable fields={softwareDataKeys} />
}
