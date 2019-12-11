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
import util from 'util';

const fetchShipment = async (id, apiUrl) => {
  const response = await axios.get(apiUrl + '/shipment/get/' + id);
  return response.data;
};

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 0,
      backgroundColor: theme.palette.background.paper,
    },
    appbar: {
      backgroundColor: '#005A95'
    }
  }));
export default function OrderFulfillment(props) {
  console.log("OrderFulfillment got props.shipments: " + util.inspect(props.shipments));
    let rows = [];
    props.order.data.lineItems.forEach(
       lineItem => {
        let newRow = lineItem;
        newRow.fulfilled=0;
        newRow.shipped=0;
        console.log("about to loop shipments: " + props.shipments.length);
        (props.shipments || []).forEach(
           shipment => {
            console.log("looping shipments: " + shipment);
            shipment.data.shipmentItems.filter(x=>x.sku==lineItem.sku).forEach(
              shipmentItem => {
                console.log("looping shipmentItem: " + shipmentItem);
                newRow.shipped += parseInt(shipmentItem.quantity);
                if (shipment.status=="DELIVERED") {
                  newRow.fulfilled += parseInt(shipmentItem.quantity);
                }
              }
            )
          }
        )
        rows.push(newRow);
       }
    )

    return(
        <Paper className={useStyles.root} width={1}>
                  <Typography  variant="h5" component="h5" gutterBottom style={{textAlign:"left"}}>
          Fulfillment
        </Typography>
        <Table className={useStyles.table} aria-label="simple table" width={1}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Ordered</TableCell>
              <TableCell align="right">Shipped</TableCell>
              <TableCell align="right">Fulfilled</TableCell>
              <TableCell align="right">CostPer</TableCell>
              <TableCell align="right">CostOrder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={props.order.id + '-' + row.sku}>
                <TableCell component="th" scope="row">
                  {row.sku}
                </TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.shipped}</TableCell>
                <TableCell align="right">{row.fulfilled}</TableCell>
                <TableCell align="right">{row.costPer} per {row.quantity_unit}</TableCell>
                <TableCell align="right">{row.totalCost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
}
