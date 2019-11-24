import React from 'react';
import {Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OI from 'react-object-inspector';
import './LetterDetailBlock.css';
import StatusChain from './StatusChain';
import getStatusTypes from './StatusTypes';
import ShowActor from './ShowActor';
import axios from 'axios';

const fetchOrder = async (id, apiUrl) => {
  const response = await axios.get(apiUrl + '/order/' + id);
  return response.data;
};
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appbar: {
    backgroundColor: '#005A95'
  }
}));
export default function OrderShipments(props) {
  let rows = [];
  props.order.data.shipments.forEach(
     shipment => {
      let newRow ={};
      newRow.id=shipment.id;
      //newRow.fulfilled=0;
      /* props.order.data.shipments.forEach(
        shipment => {
          shipment.shipmentItems.filter(x=>x.sku==lineItem.sku).forEach(
            shipmentItem => {
              if (shipment.status=="DELIVERED") {
                newRow.fulfilled += shipmentItem.quantity;
              }
            }
          )
        }
      ) */
      rows.push(newRow);
     }
  )

  return(
      <Paper className={useStyles.root} width="100%">
      <Table className={useStyles.table} aria-label="simple table" width="100%">
        <TableHead>
          <TableRow>
            <TableCell>Shipment</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => 
          <React.Fragment>
            <TableRow key={row.name}>
              <TableCell scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
            </TableRow>
            <TableRow key={row.name}>
              <TableCell scope="row" rowSpan="2">
                SHOW CHAIN OF UPDATES
              </TableCell>
            </TableRow>
            </React.Fragment>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}
