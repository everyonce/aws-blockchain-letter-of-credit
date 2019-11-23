import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import NetworkConstants from './NetworkConstants';
import SampleData from './WelcomeLetterPanel_SampleOrders';

export default function CreateWelcomePage(props) {
    const networkConstants = NetworkConstants();
    const [creating, setCreating] = React.useState(false);
     let createAll=(values) => {
      setCreating(true);
      let newItems = SampleData(networkConstants.MemberId);
      newItems.forEach(item => {
        axios.post(props.config.apiUrl + '/order/create', item
        ).then((resp) => {
          setCreating(false);
        }
        );
      })
     };
        return (
            <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
              Amazon Managed Blockchain<br />
              Supply Chain Demo
            </Typography>
            <Typography variant="h6" gutterBottom>
              Network ID: {networkConstants.NetworkId}<br />
              Member ID: {networkConstants.MemberId}
            </Typography>
            <Typography gutterBottom>
              Welcome to the supply chain demo on Amazon Managed Blockchain!  You can use the buttons below to quickly create some demo orders and shipments, or use the last tab to create one specific to your demo needs.
            </Typography>
            <DialogActions>
                    <Button
                      type="button"
                      className="outline"
                      onClick={createAll}
                      disabled={creating}
                    >
                      Create Some Demo Orders
                    </Button>
                    <Button
                      type="button"
                      className="outline"
                      disabled={true}
                    >
                      Delete All Orders
                    </Button>
                    </DialogActions>
            </Container>
        )
    };