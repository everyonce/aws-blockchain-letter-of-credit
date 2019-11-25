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

const fetchOrder = async (id, apiUrl) => {
  const response = await axios.get(apiUrl + '/order/' + id);
  let order = response.data;
  if (!order.data.lineItems)
    order.data.lineItems = [];
  if (!order.data.shipments)
    order.data.shipments = [];
  return order;
};

export default function SingleOrder(props) {
    const statusList = getStatusTypes().order;
    const [item, setItem] = React.useState();
    
    React.useEffect(() => {
      if(!item) {
        fetchOrder(props.id,props.config.apiUrl).then(result=>setItem(result));
      }
    }, [props.id,props.config.apiUrl,item]);


    if (!item )  {
      return (
        <h1>Loading</h1>
      );
    }

    props.config.addUpdateHook(
      props.id, 
      () => fetchOrder(props.id, props.config.apiUrl).then(result=>setItem(result))
    );

    return (
<Grid
  container
  spacing={0}
  alignItems="center"
  justify="center"
  direction="column"
>
  <Grid  container item alignItems="center" justify="center" direction="column">
    <Grid item>
      <Typography  variant="h6" component="h6" gutterBottom style={{textAlign:"left"}}>
      {item.data.description} [{item.id}]
      </Typography>
      <Typography  variant="h6" component="h6" gutterBottom style={{textAlign:"left"}}>
          Current Status:{ item.status}
      </Typography>
    </Grid>
    <Grid  container item alignItems="center" justify="center" direction="column">
      <Grid item>
        <Typography  variant="h5" component="h5" gutterBottom style={{textAlign:"left"}}>
          Fulfillment
        </Typography>
        <OrderFulfillment order={item} />
      </Grid>
      <Grid item>
        <Typography  variant="h5" component="h5" gutterBottom style={{textAlign:"left"}}>
          Shipments
        </Typography>
        <OrderShipments order={item} />
      </Grid>
    </Grid>
  </Grid>   
</Grid>
  
  )
  }