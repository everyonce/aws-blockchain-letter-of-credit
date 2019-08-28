/* eslint-disable no-script-url */
import React, { Component } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import OI from 'react-object-inspector';
import LabelImportant from '@material-ui/icons/LabelImportant';
import Link from '@material-ui/icons/Link';
import CropSquare from '@material-ui/icons/CropSquareTwoTone';
import './LetterDetailBlock.css'

const statusList=[
  {status:"NEW",desc:"Waiting on Selling Bank to CONFIRM receipt"},
  {status:"TERMS_SELLER_APPROVAL",desc:"Waiting on Selling Bank to APPROVE terms or COUNTER"},
  {status:"TERMS_BUYER_APPROVAL",desc:"Waiting on Buying Bank to APPROVE terms or COUNTER"},
  {status:"TERMS_APPROVED",desc:"Waiting on Seller to CONFIRM shipment"},
  {status:"SHIPPED",desc:"Waiting on Seller and ThirdParties to add documents and once complete, CONFIRM packet"},
  {status:"PACKET_SELLER_READY",desc:"Waiting on Selling Bank to APPROVE packet"},
  {status:"PACKET_BUYER_READY",desc:"Waiting on Buying Bank to APPROVE packet"},
  {status:"CLOSED",desc:"No further actions needed"}
  ];

const API = window.location+'/';
const DEFAULT_QUERY = 'letter/';

export default class LetterDetailBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      letterId:'',
      letter: {},
      isLoading: false,
      error: null,
    };
    this.props.globalLetterSelector.func.callbackList.push(this.updateLetter.bind(this));
    this.props.globalLetterSelector.func.refreshList.push(this.updateLetter.bind(this));
  }

  updateLetter(newLetterId) {
    if (!newLetterId && this.state.letterId) {
      newLetterId = this.state.letterId;
    }
    if (newLetterId && newLetterId.length>0){
      this.setState({
        letterId:newLetterId,
        isLoading:true});
      axios.get(API + DEFAULT_QUERY + newLetterId)
      .then(result => this.setState({
          letter: result.data,
          isLoading: false })
        )
      .catch(error => this.setState({ error: error, isLoading: false }));
      ; 
    }
  }

  handleClick(e) {
    e.preventDefault();
    //alert('The link was clicked: ' + this.state.letterId);
  }

  componentDidMount() {
    //this.updateLetter();
  }

  render() {
    const { letter, isLoading, error } = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    var l = letter;
    if (this.state.letterId) {
    var p = statusList.findIndex(x=>x.status===l.letterStatus);
    return (
        <React.Fragment>

              <Typography variant="h4"  color="primary" gutterBottom>
                  {l.letterDescription}
              </Typography>
              <Typography variant="h6"  color="primary" gutterBottom>
                  {l.letterId}
              </Typography>
              <div style={{display: 'flex', margin: '0px'}}>
              { statusList.map((x, i) => 
              {var c='green'; var link='';  if (i===p) {c='yellow'} else if (i>p) {c='gray'}
              if (i>0) {link=(<Link classes='rotate-45' key={l.id + ':' + i} style={{ width:40, height:40, 'z-index':-1, color: 'gray',margin: '14px -20' }} />)}
              return (<React.Fragment>
                 {link}
                 <CropSquare key={l.id + ':' + i} style={{ width:64, height:64, 'z-index':5, color: c,margin: '0px' }} />
                 </React.Fragment>);
              })}
              </div>
              <Typography variant="body2"  color="primary" gutterBottom>
                  {(statusList[p] || {desc:'unknown'}).desc || 'unknown'}
              </Typography>
          <Table size="small">
            <TableBody>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{l.letterStatus}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>
                  {(l.productDetails)?l.productDetails.map((x) => 
                  <OI key={"product"+x.productSku} data={x} name={x.productSku}/>
                  ):'Cannot load, retry'
                  }
                  
                 </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Rules</TableCell>
                  <TableCell>
                  {(l.rules)?l.rules.map((x) => 
                  <OI key={"rule"+x.metric} data={x} name={x.metric}/>
                  ):'Cannot load, retry'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Current Approvals</TableCell>
                  <TableCell>
                  {(l.approvalRecord)?l.approvalRecord.map((x) => 
                  <OI  key={"approval"+x.STAGE+x.ROLE} data={x} name={x.STAGE + ' [' + x.ROLE  + ']: ' + x.ACTION}/>
                  ):'Cannot load, retry'}
                  </TableCell>
                </TableRow>
</TableBody>
          </Table>
        </React.Fragment>
     );
    } else {
      return (
        <React.Fragment>
                  Please select an item on the left.
                  </React.Fragment>

      );
    }
  }

}
