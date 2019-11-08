import React from 'react';
import {BankIcon, PersonIcon, WarehouseIcon, FactoryIcon, TruckIcon} from './Icons';
import getStatusTypes from './LetterStatusTypes';
import axios from 'axios';
import { Typography, Button } from '@material-ui/core';

function ActorIcon(props) {
    switch(props.icon) {
        case "bank":
          return (<BankIcon sel={props.sel} height={'80px'} width={'80px'} />);
        case "person":
          return (<PersonIcon sel={props.sel} height={'80px'} width={'80px'} />);
        case "warehouse":
          return (<WarehouseIcon sel={props.sel} height={'80px'} width={'80px'} />);
        case "factory":
          return (<FactoryIcon sel={props.sel} height={'80px'} width={'80px'} />);
        case "truck":
          return (<TruckIcon sel={props.sel} height={'80px'} width={'80px'} />);
        default:
          // code block
      }
    return (<PersonIcon sel={props.sel} height={'80px'} width={'80px'} />);
}

export default 
function ShowActor(props) {
    const [working, setWorking] = React.useState(false);

    const doAction = (event) => {
        setWorking(true);
        axios.post(props.config.apiUrl + '/action', 
        {"letterId":letter.letterId,
           "action":event.currentTarget.value}
        ).then((resp) => {
          setWorking(false);
        }
        );
    }

    let letter = props.letter
    let sel=false;
    let s={ 
        alignItems: 'flex-start',
        direction: 'column',
        textAlign: 'center',
        padding: '10px',
        color: '#777777'
    };
    let bs={
        backgroundColor: '#005A95',
        color: 'white'
    }
    let actorActions=[];
    const statusList = getStatusTypes();
    let thisStatus = statusList[statusList.findIndex(x=>x.status===letter.letterStatus)];
    let actorCan = thisStatus.whoCan.filter(x=> props.actor in x);

    if (actorCan.length>0) {
        s.border= '2px solid #005A95';
        s.backgroundColor='#ECF7FF';
        s.color='#005A95';
        sel=true;
        actorActions = actorCan[0][props.actor]; 
    }
    return (
        <div style={s}>
            <ActorIcon sel={sel} {...props} /><br />
            <Typography>{props.actor}</Typography><br />
            {actorActions.map(x=>
                <React.Fragment key={letter.letterId+"-"+props.actor+"-"+x}>
                    <Button disabled={working} value={x} onClick={doAction} style={(!working)?bs:[]}>{x}</Button><br />
                </React.Fragment>
            )}
        </div>
    );
}