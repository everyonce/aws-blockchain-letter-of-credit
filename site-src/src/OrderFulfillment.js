import React from 'react';
import {Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
export default function OrderFulfillment(props) {
    let rows = [];
    props.order.data.lineItems.forEach(
       lineItem => {
        let newRow ={};
        newRow.ordered=1;
        newRow.fulfilled=0;
        props.order.data.shipments.forEach(
          shipment => {
            shipment.shipmentItems.filter(x=>x.sku==lineItem.sku).forEach(
              shipmentItem => {
                if (shipment.status=="DELIVERED") {
                  newRow.fulfilled += shipmentItem.quantity;
                }
              }
            )
          }
        )
       }
    )

    return(
        <Paper className={useStyles.root}>
        <Table className={useStyles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Ordered</TableCell>
              <TableCell align="right">Fulfilled</TableCell>
              <TableCell align="right">CostPer</TableCell>
              <TableCell align="right">CostOrder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
}
