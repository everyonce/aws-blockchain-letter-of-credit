/* eslint-disable no-script-url */
import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
//import util from 'util';

export default class LetterListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      letter:props.letter
    };
  }

  render(){
    //alert("LLI we've got this as this.props.updateFunc: " + util.inspect(this.props.globalLetterSelector));
    var l = this.state.letter;
    var func = this.props.globalLetterSelector.selectLetter;
    var cb = this.props.globalLetterSelector.callbackList;
      return(
          <ListItem button onClick={ func(l.letterId, cb) } key={l.letterId}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={l.letterDescription} secondary={l.letterStatus} />
        </ListItem>
      )
  }
}
