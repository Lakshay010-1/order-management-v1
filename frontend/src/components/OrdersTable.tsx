import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./styles/DataTable.module.css";
import { type Order } from "../types/Order";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "./AlertDialog";

const fields_a = [
  { name: "Order ID", key: "id", type: "text" },
  { name: "PO Number", key: "po_number", type: "text" },
  { name: "PO Type", key: "po_type", type: "text" },
  { name: "PO Date", key: "po_date", type: "date" },
  { name: "Party", key: "party", type: "text" },
  { name: "Status", key: "status", type: "text" },
];

const fields_hardware = [
  { name: "Order", key: "", type: "date" },
  {
    name: "Expected Installation",
    key: "hardware_installation_expected_date",
    type: "date",
  },
  { name: " Installation", key: "hardware_installation_date", type: "date" },
];
const fields_software = [
  {
    name: "Expected Installation",
    key: "software_installation_expected_date",
    type: "date",
  },
  { name: " Installation", key: "software_installation_date", type: "date" },
];

function Row(props: {
  onRow: number | null;
  row: Order;
  setOnRow: any;
  onClick: (id: number) => void;
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
  ) => void;
}) {
  const { row, onRow, setOnRow, handleDelete } = props;
  const rowStyles = {
    onMouseEnter: () => setOnRow(row.id),
    onMouseLeave: () => setOnRow(null),
    style: {
      backgroundColor: onRow == row.id ? "gold" : "",
      borderStyle: "solid none",
      border: "1px solid #ebeef0",
    },
  };

  return (
    <React.Fragment>
      <TableRow
        {...rowStyles}
        onClick={() => props.onClick(row.id)}
        sx={{ "& > .MuiTableCell-root": { borderBottom: "unset" } }}
      >
        {fields_a.map((field, idx) => {
          const { key, type } = field;
          let data = row[key];
          data = !data ? "-" : data;
          data =
            data != "-" && type == "date"
              ? new Date(data).toLocaleDateString("en-GB")
              : data;
          return (
            <TableCell key={idx} align="left">
              {data}
            </TableCell>
          );
        })}
        {fields_hardware.map((field, idx) => {
          const { key, type } = field;
          let data = key ? row[key] : "";
          if (!key && row["materials"] && row.materials.length != 0) {
            data = row.materials[0].order_date;
          }
          data = !data ? "-" : data;
          data =
            data != "-" && type == "date"
              ? new Date(data).toLocaleDateString("en-GB")
              : data;
          return (
            <TableCell align="center" key={idx}>
              {data}
            </TableCell>
          );
        })}
        {fields_software.map((field, idx) => {
          const { key, type } = field;
          let data = key ? row[key] : "";
          data = !data ? "-" : data;
          data =
            data != "-" && type == "date"
              ? new Date(data).toLocaleDateString("en-GB")
              : data;
          return (
            <TableCell align="center" key={idx}>
              {data}
            </TableCell>
          );
        })}
        <TableCell>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.red}`}
            onClick={(e) => handleDelete(e, row.id)}
            aria-label="Delete row"
          >
            <DeleteIcon className={styles.whiteColor} />
          </button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({
  orders,
  handleDelete,
  handleOrdersSort,
}: {
  orders: Array<Order>;
  handleDelete: (id: number) => void;
  handleOrdersSort: (key: string) => void;
}) {
  const [onRow, setOnRow] = React.useState(null);
  const [orderDeleteId, setOrderDeleteId] = React.useState(-1);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTitle, setdialogTitle] = React.useState("");
  const [dialogMsg, setdialogMsg] = React.useState("");

  const navigate = useNavigate();

  function handleOrderRowClick(order_id: number) {
    navigate(`/orders/${order_id}`);
  }

  function handleDecision(decision: boolean) {
    if (decision) {
      handleDelete(orderDeleteId);
    }

    setOpenDialog(false);
  }

  function handleDeleteClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
  ) {
    e.stopPropagation();
    setOpenDialog(true);
    setOrderDeleteId(id);
    setdialogMsg(
      `Click \n 'DELETE' to proceed to delete order:${id}\nOR\n'CANCEL' to cancel the operation`,
    );
    setdialogTitle(`Delete Order:${id}`);
  }

  function handleAddMode() {
    navigate(`/orders/new`);
  }
  return (
    <div className={styles.tableContainer}>
      <AlertDialog
        open={openDialog}
        setDecision={handleDecision}
        message={dialogMsg}
        title={dialogTitle}
      />
      <TableContainer component={Paper} style={{ border: "1px solid black" }}>
        <Table aria-label="collapsible table">
          <TableHead style={{ backgroundColor: "#d0d8e1" }}>
            <TableRow>
              {fields_a.map((field, idx) => (
                <TableCell
                  className={`${styles.fieldTableCell} ${styles.horizontalBorderss}`}
                  key={idx}
                  rowSpan={2}
                  align="left"
                  onClick={() => handleOrdersSort(field.key)}
                >
                  {field.name}
                </TableCell>
              ))}
              <TableCell
                colSpan={3}
                align="center"
                className={styles.horizontalBorders}
                style={{
                  borderWidth: "0 1px",
                }}
              >
                Hardware Dates
              </TableCell>
              <TableCell
                colSpan={2}
                align="center"
                className={styles.horizontalBorders}
                style={{
                  borderWidth: "0 1px",
                }}
              >
                Software Dates
              </TableCell>

              <TableCell
                rowSpan={2}
                className={`${styles.tableCell} ${styles.green}`}
                onClick={() => handleAddMode()}
              >
                <button
                  type="button"
                  className={`${styles.addActionBtn} ${styles.green}`}
                  aria-label="Add row"
                >
                  <AddIcon className={styles.whiteColor} />
                </button>
              </TableCell>
            </TableRow>

            <TableRow>
              {fields_hardware.map((field, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  className={`${idx == 0 ? styles.leftBorder : idx == fields_hardware.length - 1 ? styles.rightBorder : ""}`}
                  style={{
                    borderWidth: "0 1px",
                  }}
                >
                  {field.name}
                </TableCell>
              ))}

              {fields_software.map((field, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  style={{
                    borderWidth: "0 1px",
                  }}
                  className={`${idx == 0 ? styles.leftBorder : idx == fields_software.length - 1 ? styles.rightBorder : ""}`}
                >
                  {field.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row
                key={order.id}
                row={order}
                onRow={onRow}
                setOnRow={setOnRow}
                onClick={handleOrderRowClick}
                handleDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
