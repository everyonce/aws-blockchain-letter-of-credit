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
    const classes = useStyles();
    const [complete, setComplete] = React.useState(false);
    let products = [];
    let rules = [];
        return (
            <Container maxWidth="sm">
            <Typography>
              TBD Nice Wording
            </Typography>
            <Typography>
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
                    >
                      Delete All Letters
                    </Button>
                    </DialogActions>
            </Container>
        )
    };