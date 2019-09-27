import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import AddProducts from './CreateLetterPanelProducts';
import AddRules from './CreateLetterPanelRules';
import uuidv1 from 'uuid/v1';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
        padding: theme.spacing(3, 2),
    }
  }));
  
export default function CreateLetterApp(props) {
    const classes = useStyles();
    const [busy, setBusy] = React.useState(false);
    let products = [];
    let rules = [];
    return (
        <Container maxWidth="sm">
        <Formik
        initialValues={{ product: products, rule: rules, description: '', name: '', comment: '' }}
        onSubmit={(values, {setSubmitting}) => {
          setBusy(true);
          values.letterId = uuidv1();
          axios.post(props.config.apiUrl + '/createLetter',
            values,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              }
            },
          ).then((resp) => {
            setBusy(false);
          }
          );
        }}

        validationSchema={Yup.object().shape({
          letterDescription: Yup.string()
            .required('Required'),
            price: Yup.number()
            .required('Required'),
        })}

        render={({handleSubmit, handleChange, handleBlur, values, errors, touched, dirty, busy }) => {
          return (
            <form onSubmit={handleSubmit}>
                <div>
              <TextField
                label="Supplier Name/Description"
                name="letterDescription"
                className={classes.textField}
                value={values.letterDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={(errors.letterDescription && touched.letterDescription) && errors.letterDescription}
                margin="normal"
                style={{width:'400px'}}
              />
                </div>
                <div>
              <TextField
                label="Total Price"
                name="price"
                className={classes.textField}
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={(errors.price && touched.price) && errors.price}
                margin="normal"
                style={{width:'400px'}}
              />
              </div>
                <div>
              <TextField
                label="Comment"
                name="comment"
                className={classes.textField}
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={(errors.comment && touched.comment) && errors.comment}
                margin="normal"
                style={{width:'400px'}}
              />
              </div>
              <AddProducts  handleChange={handleChange} handleBlur={handleBlur}  values={values}  errors={errors} touched={touched} dirty={dirty} classes={classes} />
              <AddRules     handleChange={handleChange} handleBlur={handleBlur}  values={values}  errors={errors} touched={touched} dirty={dirty} classes={classes} />
              <DialogActions>
                <Button
                  type="button"
                  className="outline"
                  // onClick={handleReset}
                  disabled={!dirty || busy}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={busy}>
                  Submit
                </Button>
                {/* <DisplayFormikState {...props} /> */}
              </DialogActions>
            </form>
          );
        }}
      />
            </Container>
        )
    };