import React from 'react';
import {Tooltip, Typography} from '@material-ui/core';
import {CubeIcon, ChainLink} from './Icons';
import moment from 'moment';

    export default function StatusChain(props) {

        var p = props.statusList.findIndex(x=>x.status===props.letter.letterStatus);
        return (
            <div style={{display: 'flex', margin: '0px', alignItems: 'center', textAlign: 'center'}}>
              { props.statusList.map((x, i) => 
                { 
                    var stageApprovals=props.letter.approvalRecord.filter(z=>z.STAGE===x.status);
                    var stageDescription=(<React.Fragment>
                    <Typography color="inherit">
                    {x.status}<br />
                    <em>{x.desc}</em>
                    <ul>
                        {(stageApprovals.length===0 && i<p)?
                         (<li>APPROVAL N/A</li>):           
                        stageApprovals.map(approval =>
                        <li>{approval.ROLE || "no role"} Approval ({
                            moment(approval.TIMESTAMP.Seconds).format("DD-MM-YYYY HH:mm:ss")
                             || "no timestamp"})</li>
                        )}
                    </ul>
                    </Typography>
                  </React.Fragment>);

                    var link=''; 
                    var c={topfill:'#80ACCA',rightfill:'#4083AF',leftfill:'#005A95'}; 
                    if (i===p) 
                        {c={topfill:'#BADC82',rightfill:'#84A450',leftfill:'#49651B'}} 
                    else if (i>p) 
                        {c={topfill:'#DDDDDD',rightfill:'#AAAAAA',leftfill:'#858585'}}
                if (i>0) {
                    link=(<ChainLink height={22} width={22} style={{padding: '10px'}} />)
                    }
                return (<React.Fragment>
                    {link}
                    <Tooltip disableFocusListener title={stageDescription}>
                        <div>
                            <CubeIcon  fills={c}/>
                        </div>
                    </Tooltip>
                    </React.Fragment>);
              })}
              </div>
        )
    }