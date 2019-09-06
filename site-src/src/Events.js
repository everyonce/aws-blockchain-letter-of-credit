/* eslint-disable no-script-url */
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import Websocket from 'react-websocket';
import OI from 'react-object-inspector';
//import { util } from 'prettier';
import util from 'util';
var dateFormat = require('dateformat');


export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };

  }

  componentDidMount() {
    this.handleData('{"event":"listener started"}');
    
  }

  handleData(data) {
    console.log("WS data:" + data);
    try {
      let result = JSON.parse(data);
      var {events} = this.state;
      var ts = Date.now();
      var maxid=0;
      events.forEach(x => {
        if (x.id >maxid) maxid = x.id;
      });
      maxid=maxid+1;

      if (result["blockEvent"]) {
        result={"id":maxid, "timestamp":ts, "event":{"newBlock":result}};
      } else if (result["ccEvent"]) {
        result={"id":maxid, "timestamp":ts, "event":{"ledgerEvent":result["ccEvent"]} };
      } else if (result["event"]["data"]) {
        return;
      } else {
        result={"id":maxid, "timestamp":ts, "event":result};
      }
      events.push(result);
      this.setState({events: events});
      this.props.globalLetterSelector.func.needRefresh(this.props.globalLetterSelector.refreshList);
    } catch(e) {
        console.log("Couldn't parse ws data as json: "+e.toString());
    }
  }

  render() {
    const { events } = this.state;
    console.log(util.inspect(this.props.config));
    return (

      <React.Fragment>

      <Typography  color="primary" gutterBottom>SmartContract Events</Typography>
      <Table fixedheader="false" style={{tableLayout: "auto" }}>
      <colgroup>
          <col width="225" />
          <col  />
      </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Event</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(row => {
            console.log(util.inspect(row));
            var thisname= Object.keys(row.event)[0].toString();
return (
            <TableRow key={row.id}>
              <TableCell>{dateFormat(row.timestamp, "yyyy-mm-dd, hh:MM:ss TT")}</TableCell>
              <TableCell>
              <OI data={row.event} name={thisname} initialExpandedPaths={['root', 'root.event','root.newBlock', 'root.ledgerEvent']}/>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      <Websocket url={this.props.config.wsUrl} onMessage={this.handleData.bind(this)}/>
    </React.Fragment>
     );
  }

}

