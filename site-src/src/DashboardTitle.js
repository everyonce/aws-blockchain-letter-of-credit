/* eslint-disable no-script-url */
import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

export default class DashboardTitle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title:"Blockchain Dashboard"
    };
  }

  handleClick = (item) => (e) => {
      e.preventDefault()    
      alert(`This has access to item ${item}! and event(e)`)
  }

  render(){
    var l = this.state.title;
      return(
        <Typography component="h1" variant="h6" color="inherit" noWrap className={this.props.classes.title}>
          {l}
        </Typography>
      )
  }
}
