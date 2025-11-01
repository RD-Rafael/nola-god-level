import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';




export default function BasicSelect({options, selectedValue, updateValue}) {
  const handleChange = (event) => {
    updateValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value = {selectedValue}
          displayEmpty
        >
        {options.map((option) => (
          <MenuItem
            key={option.key}
            value={option.value}
          >
          {option.key}
          </MenuItem>
        ))}
        </Select>
      </FormControl>
    </Box>
  );
}