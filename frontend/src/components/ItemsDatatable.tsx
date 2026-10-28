import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useState } from "react";

import styles from "./styles/ItemsDatatable.module.css";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

export default function BasicTable<T>({
  fields,
  data,
  handleUpdate,
  intialState,
  handleDelete,
  handleAdd,
}: {
  fields: Array<string>;
  data: Array<T>;
  intialState: Partial<T>;

  // Called when an edited row is saved.
  handleUpdate: (id: number, updatedData: T) => void;

  handleDelete: (id: number) => void;

  // Optional callback for adding a new row.
  handleAdd?: (newData: T) => void;
}) {
  const [addRow, setAddRow] = useState<boolean>(false);
  const [updateRow, setUpdateRow] = useState<number | null>(null);

  const [tempDataUnit, setTempDataUnit] = useState<Partial<T>>(() => ({
    ...intialState,
  }));

  // Always return a string for controlled input values.
  function getInputValue(
    row: Partial<T> | null | undefined,
    field: string,
  ): string {
    const value = row?.[field as keyof T];

    return value === null || value === undefined ? "" : String(value);
  }

  // Update the draft row without mutating the original data.
  function handleFieldChange(field: string, value: string) {
    setTempDataUnit(
      (prev) =>
        ({
          ...prev,
          [field]: value,
        }) as Partial<T>,
    );
  }

  function handleAddMode() {
    setUpdateRow(null);
    setTempDataUnit({ ...intialState });
    setAddRow(true);
  }

  function handleAddCancel() {
    setTempDataUnit({ ...intialState });
    setAddRow(false);
  }

  function handleAddConfirm() {
    if (!handleAdd) return;

    handleAdd({ ...tempDataUnit } as T);

    setTempDataUnit({ ...intialState });
    setAddRow(false);
  }

  function handleEditCancel() {
    setTempDataUnit({ ...intialState });
    setUpdateRow(null);
  }

  function handleEditMode(row: T) {
    setAddRow(false);
    setUpdateRow(row.id);
    setTempDataUnit({ ...row });
  }

  function handleEdit() {
    if (updateRow === null) return;

    const originalRow = data.find((row) => row.id === updateRow);

    if (!originalRow) {
      handleEditCancel();
      return;
    }

    // Preserve the original row and submit the edited draft.
    handleUpdate(updateRow, {
      ...originalRow,
      ...tempDataUnit,
      id: originalRow.id,
    });

    setTempDataUnit({ ...intialState });
    setUpdateRow(null);
  }

  return (
    <div className={styles.container}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="items table">
          <TableHead style={{ backgroundColor: "#d0d8e1" }}>
            <TableRow>
              {fields.map((field) => (
                <TableCell align="center" key={field}>
                  {field}
                </TableCell>
              ))}

              <TableCell
                className={`${styles.tableCell} ${styles.green}`}
                onClick={handleAddMode}
              >
                <button
                  type="button"
                  className={`${styles.addActionBtn} ${styles.green}`}
                  aria-label="Add row"
                >
                  <AddIcon />
                </button>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {addRow && (
              <TableRow>
                {fields.map((field) => (
                  <TableCell align="center" key={field} style={{ padding: 0 }}>
                    {field !== "id" && field !== "created_at" && (
                      <input
                        placeholder={field}
                        name={field}
                        value={getInputValue(tempDataUnit, field)}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                      />
                    )}
                  </TableCell>
                ))}

                <TableCell>
                  <div className={styles.actionBtnContainer}>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.blue}`}
                      onClick={handleAddConfirm}
                      disabled={!handleAdd}
                      aria-label="Save new row"
                    >
                      <AddIcon className={styles.blackColor} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.black}`}
                      onClick={handleAddCancel}
                      aria-label="Cancel adding row"
                    >
                      <CancelIcon className={styles.redColor} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {data.map((dataUnit) => {
              const isEditing = updateRow === dataUnit.id;

              return (
                <TableRow key={dataUnit.id}>
                  {fields.map((field) => (
                    <TableCell
                      key={field}
                      align="center"
                      style={{ padding: 0 }}
                    >
                      <input
                        disabled={
                          !isEditing || field === "id" || field === "created_at"
                        }
                        className={
                          isEditing && field !== "id" ? styles.editData : ""
                        }
                        name={field}
                        value={getInputValue(
                          isEditing ? tempDataUnit : dataUnit,
                          field,
                        )}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
                      />
                    </TableCell>
                  ))}

                  <TableCell>
                    <div className={styles.actionBtnContainer}>
                      {isEditing ? (
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.blue}`}
                          onClick={handleEdit}
                          aria-label="Save changes"
                        >
                          <DoneIcon className={styles.blackColor} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.gold}`}
                          onClick={() => handleEditMode(dataUnit)}
                          aria-label="Edit row"
                        >
                          <EditIcon className={styles.whiteColor} />
                        </button>
                      )}

                      {isEditing ? (
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.black}`}
                          onClick={handleEditCancel}
                          aria-label="Cancel editing"
                        >
                          <CancelIcon className={styles.redColor} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.red}`}
                          onClick={() => handleDelete(dataUnit.id)}
                          aria-label="Delete row"
                        >
                          <DeleteIcon className={styles.whiteColor} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
