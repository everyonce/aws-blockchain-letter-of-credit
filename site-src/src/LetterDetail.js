/* eslint-disable no-script-url */
import { mainListItems } from './listItems';
import React, { Component } from 'react';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';

const API = 'http://'+window.location.hostname+':3000/';
const DEFAULT_QUERY = 'letter/';

export default class LetterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      letterId:'',
      letter: {},
      isLoading: false,
      error: null,
    };

  }
  updateLetter() {
    //var id = this.state.letterId;
    
    if (letterId.length>0){
    this.setState({ isLoading: true });
    axios.get(API + DEFAULT_QUERY + id)
      .then(result => this.setState({
          letter: result.data,
          isLoading: false })
        )
      .catch(error => this.setState({ error, isLoading: false }));
      ; 
    }
  }

  handleClick(e) {
    e.preventDefault();
    //alert('The link was clicked: ' + this.state.letterId);
  }

  componentDidMount() {
    this.updateLetter();
  }
  render() {
    const { letters, isLoading, error } = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading ...</p>;
    }
  
    return (
        <React.Fragment>
            <List>
            <ListSubheader inset>Letter of Credit Records</ListSubheader>
            {letters.map(l =>
            <ListItem button onClick={this.handleClick} key={l.letterId}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={l.letterDescription} secondary={l.letterStatus} />
              </ListItem>
        )}
        </List>
        </React.Fragment>
     );
  }

}
