import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButton({callback}) {
  return (
    <Button
      variant = "contained"
      onClick={() => {
        callback();
      }}
      style = {{
        alignItems: 'center',
      }}
    >
    Criar Métrica
    </Button>

  );
}