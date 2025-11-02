import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, optionName, theme) {
  return {
    fontWeight: optionName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect({ selectedStores, options, onChange }) {
  const theme = useTheme();

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Select
          multiple
          value={selectedStores}
          displayEmpty
          onChange={(e) => {
            onChange(e);
          }}
          input={<OutlinedInput label="Lojas" />}
          MenuProps={MenuProps}

          sx={{
            backgroundColor: '#1976d2', 

            color: 'white',

            '.MuiSelect-icon': {
              color: 'white', 
            },

            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent', 
            },

            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent', 
            },

            '&.Mui-focused .MDuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent', 
            },
          }}

        >
          {options.map((option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              style={getStyles(option.key, selectedStores, theme)}
            >
              {option.key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
