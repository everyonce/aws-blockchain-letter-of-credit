import React, {Component} from 'react';
import Dashboard from './Dashboard';
//import util from 'util';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"Blockchain Dashboard"
    };
    this.props=props;
  }
  globalLetterSelector={
    callbackList:[],
    refreshList:[],
    selectLetter: (item, callbackList) => (e) => {
      e.preventDefault()    
      //alert(`APP.SELECTLETTER: This has access to item ${item}! and event(e)`)
      callbackList.forEach(element => {
        //alert('APP.SELECTLETTER - trying a callback:');
        element(item);
      });
    },
    needRefresh: (refreshList) => {
      //console.log("inside needrefresh loop, here's the list: "+ util.inspect(refreshList));
      //e.preventDefault();
      refreshList.forEach(element => {
        //alert('APP.NEEDREFRESH - trying a callback:');
        element();
      });
    }
    
  }


  render() {
    return(
    <Dashboard func={this.globalLetterSelector} />
    );
  }
}
