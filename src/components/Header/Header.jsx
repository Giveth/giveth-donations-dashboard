import React from 'react';
import { Grid, Typography, IconButton } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

const Header = ({ onHelp }) => (
  <Grid
    container
    direction="row"
    alignItems="center"
    spacing={16}
    style={{ padding: '0.5rem' }}
  >
    <Grid item>
      <Typography variant="title">Giveth Donations Dashboard</Typography>
    </Grid>
    <Grid item>
      <IconButton aria-label="Delete" onClick={() => onHelp && onHelp()}>
        <HelpIcon />
      </IconButton>
    </Grid>
  </Grid>
);

export default Header;
