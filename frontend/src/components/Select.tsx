import React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

export default function BasicSelect({
  options,
  selectedOption,
  handleOptionChange,
  isDisabled,
  required = false,
}: {
  options: Array<{ id: number; value: string }>;
  selectedOption: { id: number; value: string };
  handleOptionChange: (id: number) => void;
  isDisabled?: boolean;
  required?: boolean;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    handleOptionChange(Number(event.target.value));
  };

  return (
    <Box>
      <Select
        labelId="nav-bar-select-label"
        id="nav-bar-select"
        value={String(selectedOption.id == -1 ? "" : selectedOption.id)}
        onChange={handleChange}
        disabled={isDisabled ?? false}
        style={{
          width: "100%",
          ...(required ? { border: "1px solid red" } : {}),
        }}
      >
        {options.map((curItem: { id: number; value: string }, idx: number) => (
          <MenuItem key={idx} value={String(curItem.id)}>
            {curItem.value}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
