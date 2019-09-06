import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OI from 'react-object-inspector';
import './LetterDetailBlock.css';
import StatusChain from './StatusChain';
import getStatusTypes from './LetterStatusTypes';
import ShowActor from './ShowActor';

export default function SingleLetter(props) {
    const statusList = getStatusTypes();
    const [letter, setLetter] = React.useState();
    React.useEffect( () => {
        const fetchLetter = async () => {
            console.log("fetching letter details for props.letterId: " + props.letterId);
            const response = await axios.get(props.config.apiUrl + '/letter/' + props.letterId);
            setLetter(response.data);
            console.log("got letter details for props.letterId: " + props.letterId + ": " + response.data);
          };
    
        fetchLetter() }, [props] );
    
    console.log("rendering singleLetter: "+(letter|| {letterId:"noletter"}).letterId +" propId: " + props.letterId);
    if (!letter ) return ("Loading");

    return (
<Grid
  container
  spacing={0}
  alignItems="center"
  justify="center"
  direction="column"
>
  <Grid item>
  <StatusChain statusList={statusList} letter={letter} letterId={props.letterId} /><br />
        <Typography component="h3" gutterBottom>
          Letter: {letter.letterDescription} <br />
        </Typography>
  </Grid>   
  <Grid
    item
    container
    sm={10}
    spacing={2}
    alignItems="flex-start"
    justify="center"
    >
    {[      {actor:"Buyer", icon:"person"},
            {actor:"BuyerBank", icon:"bank"},
            {actor:"SellerBank", icon:"bank"},
            {actor:"Seller", icon:"person"},
        ].map(x => 
            <Grid item xs={6} sm={3} justify="center">
                <ShowActor actor={x.actor} icon={x.icon} letter={letter} />
            </Grid> )}
    </Grid>
    <Grid item>
    <Typography gutterBottom>
        {props.letterId} <br />
          Status: {letter.letterStatus} <br />
          Next: {statusList[statusList.findIndex(x=>x.status===letter.letterStatus)].desc}<br />
          {(letter.productDetails)?letter.productDetails.map((x) => 
                  <OI key={"product"+x.productSku} data={x} name={x.productSku}/>
                  ):'Cannot load, retry'
                  }

</Typography>
    </Grid>
</Grid>
  )
  }