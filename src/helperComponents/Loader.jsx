import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex',padding:'5px 13px', alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <CircularProgress size={24}/>
    </Box>
  );
}