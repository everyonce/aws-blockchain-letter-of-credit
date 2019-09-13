import React from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import util from 'util';
import AddProducts from './CreateLetterPanelProducts';
import AddRules from './CreateLetterPanelRules';
import NetworkConstants from './NetworkConstants';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
        padding: theme.spacing(3, 2),
    }
  }));


export default function CreateWelcomePage(props) {
    const networkConstants = NetworkConstants();
    const classes = useStyles();
    const [deleting, setDeleting] = React.useState(false);
    const [creating, setCreating] = React.useState(false);
    let deleteAll=(values) => {
      setDeleting(true);
      axios.get(props.config.apiUrl + '/deleteAllLetters'
       ).then((resp) => {
        setDeleting(false);
        alert("done deleting: " + util.inspect(resp));
       }
       );
     };
     let createAll=(values) => {
      setCreating(true);
      
      axios.get(props.config.apiUrl + '/createLetter'
       ).then((resp) => {
        setCreating(false);
        alert("done creating: " + util.inspect(resp));
       }
       );
     };
        return (
            <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
              Amazon Managed Blockchain<br />
              Letter of Credit Demo
            </Typography>
            <Typography variant="h6" gutterBottom>
              Network ID: {networkConstants.NetworkId}<br />
              Member ID: {networkConstants.MemberId}
            </Typography>
            <Typography gutterBottom>
              Welcome to the demo Letter of Credit on Amazon Managed Blockchain!  You can use the buttons below to quickly create some demo LoCs, or use the last tab to create one specific to your demo needs.
            </Typography>
            <DialogActions>
                    <Button
                      type="button"
                      className="outline"
                    >
                      Create Some Demo Letters
                    </Button>
                    <Button
                      type="button"
                      className="outline"
                      onClick={deleteAll}
                      disabled={deleting}
                    >
                      Delete All Letters
                    </Button>
                    </DialogActions>
            </Container>
        )
    };