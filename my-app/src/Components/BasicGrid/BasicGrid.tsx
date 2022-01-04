import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BasicCard from '../Cards/BasicCard/BasicCard';


export default function BasicGrid(props: any) {
  const { size } = props;

  const topInfoCards = (
  <Grid container justifyContent="center" spacing={3}>
    <Grid key={1} item xs={2}>
      <BasicCard data={"89"} label={"Users"} />
    </Grid>
    <Grid key={2} item xs={2}>
      <BasicCard data={"80"} label={"Active Users"} />
    </Grid>
    <Grid key={3} item xs={2}>
      <BasicCard data={"29"} label={"Polls"} />
    </Grid>
    <Grid key={4} item xs={2}>
      <BasicCard data={"4"} label={"New Polls Today"} />
    </Grid>
    <Grid key={5} item xs={2}>
      <BasicCard data={"3"} label={"Admins"} />
    </Grid>
    <Grid key={6} item xs={2}>
      <BasicCard data={"70"} label={"Active Users Today"} />
    </Grid>
  </Grid>
  )

  const secondRow = (
  <Grid container justifyContent="center" spacing={3}>
    <Grid key={7} item xs={6}>
      <BasicCard data={"#23 How are you?"} />
    </Grid>
    <Grid key={8} item xs={6}>
      <BasicCard data={"#45 Where is the best pizza in Haifa?"} />
    </Grid>
  </Grid>
  )


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid item xs={12}>
        {topInfoCards}
        {secondRow}
      </Grid>
    </Box>
  );
}