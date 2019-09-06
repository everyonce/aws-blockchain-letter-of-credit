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

export default function AddProducts(props) {
  //var values=props.values;

  return (
<div>     
<FieldArray
    name='product'
    render={arrayHelpers => ( 
        <React.Fragment>
        {props.values.product.map((product, index) => (          
        <div key={index}>
    
            <Field
                name={`product.${index}`} 
                render={({ field /* _form */ }) => (
                    <React.Fragment>
                  <TextField
                    {...field}
                    label={`product.${index}.name`}
                    name={`product.${index}.name`}
                    placeholder={`product.${index}.name`}
                    className={props.classes.textField}
                    value={product.name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors[`product.${index}.quantity`] && props.touched[`product.${index}.quantity`]) && props.errors[`product.${index}.quantity`]}
                    margin="normal"
                  />

                  <TextField
                    {...field}
                    label={`product.${index}.quantity`}
                    name={`product.${index}.quantity`}
                    placeholder={`product.${index}.quantity`}
                    className={props.classes.textField}
                    value={product.quantity}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors[`product.${index}.quantity`] && props.touched[`product.${index}.quantity`]) && props.errors[`product.${index}.quantity`]}
                    margin="normal"
                  />
                  </React.Fragment>
                )}
            />
            //remove this vehicle
            <button 
                type="button"
                onClick={() => arrayHelpers.remove(index)}
                >
                Remove
            </button>   
        </div>
    ))}
    //add a new empty vehicle at the end of the list
    <button 
        type="button"
        onClick={() => arrayHelpers.push('')}
        >
        Add Product
    </button>
    </React.Fragment>
)} />
</div>
  )}