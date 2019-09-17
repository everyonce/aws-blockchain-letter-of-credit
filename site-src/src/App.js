import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import React, {Component} from 'react';
import TabBar from './TabBar';
import Websocket from 'react-websocket';


import axios from 'axios';
import util from 'util';

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      title:"Blockchain Dashboard",
      isLoading: false, letters: [], error: null 
    };
    this.props=props;
  }

  config = {apiUrl:(process.env.REACT_APP_API_URL)?process.env.REACT_APP_API_URL:window.location,
             wsUrl :(process.env.REACT_APP_WS_URL)?process.env.REACT_APP_WS_URL:
            'ws://'+window.location.hostname+(window.location.port ? ':'+window.location.port: '')+'/ws'};

  updateLetters = () => {
    this.setState({ isLoading: true, letters: [], error: null });
    axios.get(this.config.apiUrl + '/listLetters')
      .then(result => {
        console.log ("axios result return");
        return this.setState({
          letters: result.data,
          isLoading: false });
        })
      .catch(error => this.setState({ error: error, isLoading: false }));
  }
  componentDidMount = () => {
    this.updateLetters();
  }
  render() {
    console.log ("rendering app");
    if (this.state.isLoading) return (<div>LOADING</div>);
    if (this.state.error) return (<div>{util.inspect(this.state.error)}</div>);
    return (
      <React.Fragment>      
        <Websocket url={this.config.wsUrl} onMessage={(event) => alert(event)}/>
        <TabBar letters={this.state.letters} config={this.config} />
      </React.Fragment>
    );
  }
}