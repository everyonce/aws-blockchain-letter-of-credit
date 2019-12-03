import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OI from 'react-object-inspector';
import './LetterDetailBlock.css';
import StatusChain from './StatusChain';
import getStatusTypes from './StatusTypes';
import ShowActor from './ShowActor';
import OrderFulfillment from './OrderFulfillment';
import OrderShipments from './OrderShipments';
import axios from 'axios';



export default function SingleOrder(props) {
    const statusList = getStatusTypes().order;
    //const [item, setItem] = React.useState();
    
    /*React.useEffect(() => {
      if(!item) {
        //fetchOrder(props.id,props.config.apiUrl).then(result=>setItem(result));
      }
    }, [props.id,props.config.apiUrl,item]);
*/
    let orderShipments = props.shipments.filter(
      shipment => (props.order.data.shipments || []).includes(shipment.id)
    )
    if (!props.order )  {
      return (
        <h1>Loading</h1>
      );
    }

    /*props.config.addUpdateHook(
      props.id, 
      () => fetchOrder(props.id, props.config.apiUrl).then(result=>setItem(result))
    );*/

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
      {props.order.data.description} [{props.order.id}]
      </Typography>
      <Typography  variant="h6" component="h6" gutterBottom style={{textAlign:"left"}}>
          Current Status:{ props.order.status}
      </Typography>
    </Grid>
    <Grid  container item alignItems="stretch" justify="center" direction="column" width={1}>
      <Grid item padding="5" width={1} align="stretch">
        <OrderFulfillment config={props.config} order={props.order} shipments={orderShipments} />
      </Grid>
      <br />
      <Grid item padding="5" width={1} align="stretch">
        <OrderShipments order={props.order} shipments={orderShipments} />
      </Grid>
    </Grid>
  </Grid>   
</Grid>
  
  )
  }