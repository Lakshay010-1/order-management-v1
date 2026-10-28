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
        <TableCell align="left">{row.id}</TableCell>
        <TableCell align="left">{row.po_number}</TableCell>
        <TableCell align="left">{row.po_type}</TableCell>
        <TableCell align="center">
          {new Date(row.po_date).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.party}
        </TableCell>
        <TableCell align="center">{row.status}</TableCell>
        <TableCell align="center">
          {row?.materials.length <= 0
            ? "-"
            : new Date(row.materials[0].order_date).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell align="center">
          {new Date(row.hardware_installation_expected_date).toLocaleDateString(
            "en-GB",
          )}
        </TableCell>
        <TableCell align="center">
          {row.hardware_installation_date
            ? new Date(row.hardware_installation_date).toLocaleDateString(
                "en-GB",
              )
            : "-"}
        </TableCell>
        <TableCell align="center">
          {new Date(row.software_installation_expected_date).toLocaleDateString(
            "en-GB",
          )}
        </TableCell>
        <TableCell align="center">
          {row.software_installation_date
            ? new Date(row.software_installation_date).toLocaleDateString(
                "en-GB",
              )
            : "-"}
        </TableCell>
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
}: {
  orders: Array<Order>;
  handleDelete: (id: number) => void;
}) {
  const [onRow, setOnRow] = React.useState(null);
  const navigate = useNavigate();

  function handleOrderRowClick(order_id: number) {
    navigate(`/orders/${order_id}`);
  }

  function handleDeleteClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
  ) {
    e.stopPropagation();
    handleDelete(id);
  }

  function handleAddMode() {
    navigate(`/orders/new`);
  }
  return (
    <div className={styles.tableContainer}>
      <TableContainer component={Paper} style={{ border: "1px solid black" }}>
        <Table aria-label="collapsible table">
          <TableHead style={{ backgroundColor: "#d0d8e1" }}>
            <TableRow>
              <TableCell rowSpan={2} align="left">
                Order Id
              </TableCell>
              <TableCell rowSpan={2} align="left">
                PO Number
              </TableCell>
              <TableCell rowSpan={2} align="left">
                PO Type
              </TableCell>
              <TableCell rowSpan={2} align="center">
                PO Date
              </TableCell>
              <TableCell rowSpan={2}>Party</TableCell>
              <TableCell rowSpan={2} align="center">
                Status
              </TableCell>
              <TableCell
                colSpan={3}
                style={{
                  textAlign: "center",
                  borderStyle: "none solid",
                  borderColor: "grey",
                  borderWidth: "0 1px",
                }}
              >
                Hardware Dates
              </TableCell>
              <TableCell
                colSpan={2}
                style={{
                  textAlign: "center",
                  borderStyle: "none solid",
                  borderColor: "grey",
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
              {/* {Array.from({ length: 6 }, (_, idx) => (
                <TableCell key={idx} />
              ))} */}
              <TableCell
                align="center"
                style={{
                  borderLeftStyle: "solid",
                  borderColor: "grey",
                  borderWidth: "0 1px",
                }}
              >
                Order
              </TableCell>
              <TableCell align="center">Expected Installation</TableCell>
              <TableCell
                align="center"
                style={{
                  borderRightStyle: "solid",
                  borderColor: "grey",
                  borderWidth: "0 1px",
                }}
              >
                Installation
              </TableCell>
              <TableCell
                align="center"
                style={{
                  borderLeftStyle: "solid",
                  borderColor: "grey",
                  borderWidth: "0 1px",
                }}
              >
                Expected Installation
              </TableCell>
              <TableCell
                align="center"
                style={{
                  borderRightStyle: "solid",
                  borderColor: "grey",
                  borderWidth: "0 1px",
                }}
              >
                Installation
              </TableCell>
              {/* <TableCell /> */}
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
