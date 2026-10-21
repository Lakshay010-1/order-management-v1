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
    style: { backgroundColor: onRow == row.id ? "gold" : "" },
  };

  return (
    <React.Fragment>
      <TableRow
        {...rowStyles}
        onClick={() => props.onClick(row.id)}
        sx={{ "& > .MuiTableCell-root": { borderBottom: "unset" } }}
      >
        <TableCell align="left">{row.id}</TableCell>
        <TableCell component="th" scope="row">
          {row.party}
        </TableCell>
        <TableCell align="center">{row.status}</TableCell>
        <TableCell align="center">
          {new Date(row.po_date).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell align="center">
          {new Date(row.hardware_installation_date).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell align="center">
          {new Date(row.software_installation_date).toLocaleDateString("en-GB")}
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
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Order Id</TableCell>
              <TableCell>Party</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Purchase Order Date</TableCell>
              <TableCell align="center">Hardware Installation Date</TableCell>
              <TableCell align="center">Software Installation Date</TableCell>
              <TableCell
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
