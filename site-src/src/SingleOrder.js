import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OI from 'react-object-inspector';
import './LetterDetailBlock.css';
import StatusChain from './StatusChain';
import getStatusTypes from './StatusTypes';
import ShowActor from './ShowActor';
import OrderFulfillment from './OrderFulfillment';
import OrderShipments from './OrderShipments';
import util from 'util';
import axios from 'axios';



export default function SingleOrder(props) {
    const statusList = getStatusTypes().order;
    const [shipments, setShipments] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    useEffect(() => {
      updateShipments();
      props.config.addUpdateHook(
        props.order.id, 
        () => updateOrder()
      );
      props.order.data.shipments.forEach(s => {
        props.config.addUpdateHook( s,  () => updateShipments())
      });
    }, [props.order.data.shipments]);

    let updateOrder = async () => {

    };
    let updateShipments = async () => {
      setIsLoading(true);
      console.log("loading shipments for order: " + props.order.data.shipments);
      let newShipments = await Promise.all(props.order.data.shipments.map(function(s){
        let l = axios.get(props.config.apiUrl + '/shipment/get/' + s)
        .then(function(x){
          console.log("return from axios: "+ util.inspect(x.data));
          return x.data});
        console.log("axios promise data: "+ util.inspect(l));
        return l;
        }));
      console.log("finished loading shipments: "+util.inspect(newShipments));
      setShipments(newShipments);
      setIsLoading(false);
      /*asyncForEach(props.order.data.shipments, async (s, i, all) => {
        console.log("loading shipment: " + s);
        axios.get(props.config.apiUrl + '/shipment/get/' + s)
        .then(result => newShipments.push(result.data))
      }).then(() => {
        setShipments(newShipments);
        setIsLoading(false);
        console.log("finished loading " + newShipments.length + " shipments");
      });*/
    };

    if (isLoading)  {
      return (
        <h1>Loading</h1>
      );
    }


    return (
<Grid
  container
  spacing={0}
  alignItems="center"
  justify="center"
  direction="column"
>
  <Grid  container item alignItems="center" justify="center" direction="column">
    <Grid item width={1}>
      <Typography  variant="h6" component="h6" gutterBottom style={{textAlign:"left"}}>
      {props.order.data.description}
      </Typography>
      <Typography  variant="subtitle" gutterBottom style={{textAlign:"left"}}>
      [{props.order.id}]
      </Typography>
      <Typography  variant="h6" component="h6" gutterBottom style={{textAlign:"left"}}>

          Current Status:{ props.order.status}
      </Typography>
    </Grid>
    <Grid  container item alignItems="stretch" justify="center" direction="column" width={1}>
      <Grid item padding="5" width={1} align="stretch">
        <OrderFulfillment config={props.config} order={props.order} shipments={shipments} />
      </Grid>
      <br />
      <Grid item padding="5" width={1} align="stretch">
        <OrderShipments order={props.order} shipments={shipments} />
      </Grid>
    </Grid>
  </Grid>   
</Grid>
  
  )
  }