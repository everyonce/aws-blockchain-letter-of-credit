/* eslint-disable no-script-url */
import React, { Component } from 'react';
import axios from 'axios';
import List from '@material-ui/core/List';
import LetterListItem from './LetterListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
//import util from 'util';
const API = 'http://'+window.location.hostname+':3000/';
const DEFAULT_QUERY = 'listLetters';

export default class LetterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: [],
      events: [],
      isLoading: false,
      error: null
    };
    //this.handleChange = this.handleChange.bind(this);
    //globalLetterSelector={this.props.globalLetterSelector}
    this.props.globalLetterSelector.func.refreshList.push(this.updateLetters.bind(this));
  }
  updateLetters() {

    //alert('LetterList.updateLetters');
    this.setState({ isLoading: true });
    axios.get(API + DEFAULT_QUERY)
      .then(result => this.setState({
          letters: result.data,
          isLoading: false })
        )
      .catch(error => this.setState({ error, isLoading: false }));
      ; 
  }
  componentDidMount() {
    this.updateLetters();
  }
  render() {
    var { letters, isLoading, error } = this.state;
    if (!letters || !Array.isArray(letters)) letters=[];
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    //alert("LL: we've got this as this.props.updateFunc: " + util.inspect(this.props.updateFunc));
    return (
        <React.Fragment>
            <List>
            <ListSubheader inset>Letter of Credit Records</ListSubheader>
            {letters.map(l =>
              <LetterListItem globalLetterSelector={this.props.globalLetterSelector} letter={l} key={l.letterId} />
            )}
        </List>
        </React.Fragment>
     );
  }

}
