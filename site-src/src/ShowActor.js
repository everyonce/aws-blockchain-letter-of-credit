import React from 'react';
import {BankIcon, PersonIcon} from './Icons';
import getStatusTypes from './LetterStatusTypes';
import util from 'util';
import { Typography, Button, Paper, Grid } from '@material-ui/core';

function ActorIcon(props) {
    if (props.icon==="bank") 
        return (<BankIcon sel={props.sel} height={'80px'} width={'80px'} />);
    return (<PersonIcon sel={props.sel} height={'80px'} width={'80px'} />);
}

export default 
function ShowActor(props) {
    let letter = props.letter
    let sel=false;
    let s={ 
        alignItems: 'flex-start',
        direction: 'column',
        textAlign: 'center',
        padding: '10px'
    };
    let bs={
        backgroundColor: '#005A95',
        color: 'white'
    }
    let actorActions=[];
    const statusList = getStatusTypes();
    let thisStatus = statusList[statusList.findIndex(x=>x.status===letter.letterStatus)]
    let actorCan = thisStatus.whoCan.find(x=> props.actor in x)
    if (actorCan) {
        s.border= '2px solid #005A95';
        s.backgroundColor='#ECF7FF';
        sel=true;
        actorActions = actorCan[props.actor];
        console.log(util.inspect(s));
    }

    return (
        <div style={s}>
            <ActorIcon sel={sel} {...props} /><br />
            <Typography>{props.actor}</Typography><br />
            {actorActions.map(x=>
                <Button style={bs}>{x}</Button>
            )}
        </div>
    );
}