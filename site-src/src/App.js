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
  
  letterUpdateHooks= []

  addUpdateHook = (letterId, updateFunc) => { 
    this.letterUpdateHooks = this.letterUpdateHooks.filter(x => x.letterId !== letterId)
    this.letterUpdateHooks.push({letterId: letterId, updateFunc: updateFunc});
  }


  config = {apiUrl:(process.env.REACT_APP_API_URL)?process.env.REACT_APP_API_URL:window.location.origin,
            wsUrl :(process.env.REACT_APP_WS_URL)?process.env.REACT_APP_WS_URL:
                    'ws://'+window.location.hostname+(window.location.port ? ':'+window.location.port: '')+'/ws',
            addUpdateHook: this.addUpdateHook
          };

  wsEvent = (event) => {
    var jEvent=JSON.parse(event);
    console.log("Websocket event: " + util.inspect(jEvent));
    if (jEvent["ccEvent"]) {
      switch (jEvent["ccEvent"]["action"]) {
        case "CREATE":
          if (!this.state.isLoading) {
            this.updateLetters();
          }
          break;
        case "DELETE":
            this.updateLetters();
            break;
        case "CONFIRM":
            this.letterUpdateHooks.find(x => x.letterId===jEvent["ccEvent"]["letterId"]).updateFunc();
            break;
        case "APPROVE":
            this.letterUpdateHooks.find(x => x.letterId===jEvent["ccEvent"]["letterId"]).updateFunc();
            break;
        default:
          console.log("Got some other event");
      }
    }
  }

  updateLetters = () => {
    this.setState({ isLoading: true, letters: [], error: null });
    axios.get(this.config.apiUrl + '/listLetters')
      .then(result => 
        this.setState({
          letters: result.data,
          isLoading: false })
        ) 
      .catch(error => this.setState({ error: error, isLoading: false })); 
  }

  componentDidMount = () => {
    this.updateLetters();
  }

  render() {
    if (this.state.isLoading) return (<div>LOADING</div>);
    if (this.state.error) return (<div>{util.inspect(this.state.error)}</div>);
    return (
      <React.Fragment>      
        <Websocket url={this.config.wsUrl} onMessage={(event) => this.wsEvent(event)} />
        <TabBar letters={this.state.letters} config={this.config} />
      </React.Fragment>
    );
  }
}