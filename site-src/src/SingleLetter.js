import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OI from 'react-object-inspector';
import './LetterDetailBlock.css';
import StatusChain from './StatusChain';
import getStatusTypes from './LetterStatusTypes';
import ShowActor from './ShowActor';
import axios from 'axios';

const fetchLetter = async (letterId, apiUrl) => {
  const response = await axios.get(apiUrl + '/letter/' + letterId);
  return response.data;
};

export default function SingleLetter(props) {
    const statusList = getStatusTypes();
    const [item, setItem] = React.useState();
    
    React.useEffect(() => {
      if(!item) {
        fetchLetter(props.letterId,props.config.apiUrl).then(result=>setItem(result));
      }
    }, [props.letterId,props.config.apiUrl,item]);


    if (!item )  {
      return (
        <h1>Loading</h1>
      );
    }

    props.config.addUpdateHook(
      props.letterId, 
      () => fetchLetter(props.letterId, props.config.apiUrl).then(result=>setItem(result))
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
  <StatusChain statusList={statusList} letter={item} letterId={props.letterId} />
  </Grid>
  <Grid item>
    <Typography  variant="h4" component="h4" gutterBottom style={{textAlign:"center"}}>
        Next Step:<br/>
        </Typography>
        <Typography  variant="h6" component="h6" gutterBottom style={{textAlign:"center"}}>
        {statusList[statusList.findIndex(x=>x.status===item.letterStatus)].desc}
    </Typography>
    </Grid>
  </Grid>   
  <Grid
    item
    container
    sm={8}
    spacing={2}
    alignItems="flex-start"
    justify="center"
    >
    {[      {actor:"Manufacturer", icon:"factory"},
            {actor:"Logistics", icon:"truck"},
            {actor:"Warehouse", icon:"warehouse"},
            {actor:"RepairShop", icon:"person"},
        ].map(x => 
            <Grid item xs={6} sm={3} justify="center">
                <ShowActor config={props.config} actor={x.actor} icon={x.icon} letter={item} />
            </Grid> )}
    </Grid>
    <Grid item>
    <Typography gutterBottom>
        {props.letterId} <br />
          Status: {item.letterStatus} <br />
          {(item.productDetails)?item.productDetails.map((x) => 
                  <OI key={"product"+x.productSku} data={x} name={x.productSku}/>
                  ):'Cannot load, retry'
                  }

</Typography>
    </Grid>
</Grid>
  
  )
  }