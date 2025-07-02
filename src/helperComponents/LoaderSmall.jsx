import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoaderSmall = () => {
  return (
    <Box sx={{ display: 'flex',padding:'5px 13px', alignItems:'center',justifyContent:'center'}}>
      <CircularProgress size={24}/>
    </Box>
  );
};

export default LoaderSmall;
