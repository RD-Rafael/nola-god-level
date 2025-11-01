import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useState, useEffect, setState} from 'react';

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


export default function MultipleSelect({selectedStores, options, onChange}) {
  const theme = useTheme();

  useEffect(() => {
    fetch(selectedStores);
  }, [selectedStores]);

  let optionsNames = []
  for(let i = 0; i < options.length; i++){
    optionsNames.push(options[i].key)
  }



  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={selectedStores}
          onChange={(e) => {onChange(e)}}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
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
