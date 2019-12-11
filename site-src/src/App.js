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
      isLoadingOrders: false, orders: [], error: null,
      bulkChanging: false
    };
    this.props=props;
  }
  
  updateHooks= [];

  addUpdateHook = (itemId, updateFunc) => { 
    console.log("adding hook for "+itemId);
    this.updateHooks = this.updateHooks.filter(x => x.itemId !== itemId)
    this.updateHooks.push({itemId: itemId, updateFunc: updateFunc});
    //updateFunc(this.shipments);
  }
  updateBulkChanging = (newState) => {
    this.setState({ isBulkChanging: newState });
  }

  config = {apiUrl:(process.env.REACT_APP_API_URL)?process.env.REACT_APP_API_URL:window.location.origin,
            wsUrl :(process.env.REACT_APP_WS_URL)?process.env.REACT_APP_WS_URL:
                    'ws://'+window.location.hostname+(window.location.port ? ':'+window.location.port: '')+'/ws',
            addUpdateHook: this.addUpdateHook,
            updateBulkChanging: this.updateBulkChanging
          };
  generalUpdate = () => {
    if (!this.state.bulkChanging) {
      if (!this.state.isLoadingOrders) {
        this.updateOrders();
      }
    }
  }
  wsEvent = (event) => {
    var jEvent=JSON.parse(event);
    console.log("Websocket event: " + util.inspect(jEvent));
    if (jEvent["ccEvent"]) {
      switch (jEvent["ccEvent"]["action"]) {
        case "CREATE":
          this.generalUpdate();
          break;
        case "DELETE":
            this.generalUpdate();
            break;
        case "CONFIRM":
          this.generalUpdate();
          break;
        case "update":
          this.updateHooks.filter(x=>x.itemId==jEvent["ccEvent"]["item"]).forEach(x=>x.updateFunc());
          break;
        default:
          console.log("Got some other event");
          this.updateHooks.filter(x=>x.itemId==jEvent["ccEvent"]["item"]).forEach(x=>x.updateFunc());
      }
    }
  }

  updateOrders = async () => {
    this.setState({ isLoadingOrders: true, orders: [], error: null });
    axios.get(this.config.apiUrl + '/order/list')
      .then(result => 
        this.setState({
          orders: result.data,
          isLoadingOrders: false })
        )
        .catch(error => this.setState({ error: error, isLoadingOrders: false })); 
  }

  componentDidMount = () => {
    this.updateOrders();
    //console.log("Refreshed orders: " + this.state.orders);
  }

  render() {
    if (this.state.isLoadingOrders || this.state.isLoadingShipments) return (<div>LOADING</div>);
    if (this.state.error) return (<div>{util.inspect(this.state.error)}</div>);
    return (
      <React.Fragment>      
        <Websocket url={this.config.wsUrl} onMessage={(event) => this.wsEvent(event)} />
        <TabBar orders={this.state.orders} config={this.config} />
      </React.Fragment>
    );
  }
}