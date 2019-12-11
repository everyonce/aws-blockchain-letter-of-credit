import React from 'react';
import {Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import StatusChain from './StatusChain';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 0,
    backgroundColor: theme.palette.background.paper,
  },
  appbar: {
    backgroundColor: '#005A95'
  }
}));
export default function OrderShipments(props) {
  return(
      <Paper className={useStyles.root} width={1}>
         <Typography  variant="h5" component="h5" gutterBottom style={{textAlign:"left"}}>
          Shipments ({props.shipments.length})
        </Typography>
      <Table className={useStyles.table} aria-label="simple table" width={1}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Shipment</TableCell>
            <TableCell style={{ width: "50%" }}>Updates</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.shipments.map(row => 
          <React.Fragment>
            <TableRow key={row.id}>
              <TableCell scope="row"  align="left">
                {row.id}
              </TableCell>
              <TableCell scope="row">
                <StatusChain history={row.history} />
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
            </React.Fragment>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}
