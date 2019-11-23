import React from 'react';
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

export default function OrderShipments(props) {


    return(
        <div>Stuff</div>
    )
}
