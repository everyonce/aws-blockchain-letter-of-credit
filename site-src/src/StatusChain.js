import React from 'react';
import {Tooltip, Typography} from '@material-ui/core';
import {CubeIcon, ChainLink} from './Icons';
import moment from 'moment';

    export default function StatusChain(props) {
        if (!props.history) {
            return (<h4>No History</h4>);
        }
return (
            <div style={{display: 'flex', margin: '0px', alignItems: 'center', textAlign: 'center'}}>
              {
              props.history.map((x, i) => 
                { 
                    var link=''; 
                    var c={topfill:'#80ACCA',rightfill:'#4083AF',leftfill:'#005A95'}; 
                    /*if (i===p) 
                        {c={topfill:'#BADC82',rightfill:'#84A450',leftfill:'#49651B'}} 
                    else if (i>p) 
                        {c={topfill:'#DDDDDD',rightfill:'#AAAAAA',leftfill:'#858585'}} */
                if (i>0) {
                    link=(<ChainLink height={10} width={10} style={{padding: '5px'}} />)
                    }
                return (<React.Fragment>
                    {link}
                    <Tooltip disableFocusListener title={x.newStatus}>
                        <div>
                            <CubeIcon  height={30} width={30} fills={c}/>
                        </div>
                    </Tooltip>
                    </React.Fragment>);
                })
            }
              </div>
        )
    }