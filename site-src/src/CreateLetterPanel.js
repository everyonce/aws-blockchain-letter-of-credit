import React from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
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
  
export default function CreateLetterApp(props) {
    const classes = useStyles();
    const [complete, setComplete] = React.useState(false);
    let products = [];
    let rules = [];
        return (
            <Container maxWidth="sm">
            <Formik
            initialValues={{ product: products, rule: rules, description: '', name: '', comment: '' }}
            onSubmit={(values, { setSubmitting,  }) => {
             setSubmitting(true);
             //values.letterId = new Guid();
             axios.post(props.config.apiUrl + '/createLetter',
                values,
                {
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                  }
                },
              ).then((resp) => {
                setComplete(true);
              }
              );
              alert(util.inspect(values));
              setSubmitting(false);
            }}

            validationSchema={Yup.object().shape({
                description: Yup.string()
                .required('Required'),
                price: Yup.number()
                .required('Required'),
            })}

            render={ ({handleSubmit, 
                handleChange, 
                handleBlur, 
                values, 
                errors, touched, dirty, isSubmitting }) => {
              return (
                <form onSubmit={handleSubmit}>
                    <div>
                  <TextField
                    label="Supplier Name/Description"
                    name="description"
                    className={classes.textField}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={(errors.description && touched.description) && errors.description}
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
                      disabled={!dirty || isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
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