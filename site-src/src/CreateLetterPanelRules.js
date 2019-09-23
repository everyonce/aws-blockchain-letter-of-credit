import React from 'react';
import { Field, FieldArray } from 'formik';

import {Tooltip} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';


export default function AddRules(props) {
  //var values=props.values;

  return (
<div>     
<FieldArray
    name='rule'
    render={arrayHelpers => ( 
        <React.Fragment>
        {props.values.rule.map((rule, index) => (          
        <div key={index} >
            <Field
                name={`rule.${index}`} 
                render={({ field /* _form */ }) => (
                    <React.Fragment>
                  <TextField
                    {...field}
                    label={`Rule Text`}
                    name={`rule.${index}.text`}
                    className={props.classes.textField}
                    value={rule.text}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors[`rule.${index}.quantity`] && props.touched[`rule.${index}.quantity`]) && props.errors[`rule.${index}.quantity`]}
                    margin="normal"
                    style={{width:'400px'}}
                  />
                  </React.Fragment>
                )}
            />
            <Tooltip title="Remove this rule">
            <button 
                type="button"
                style={{verticalAlign:"bottom", margin:"15px"}}
                onClick={() => arrayHelpers.remove(index)}
                >
                Remove
            </button>   
            </Tooltip>
        </div>
    ))}
<Tooltip title="Add a rule">
    <button 
        type="button"
        style={{verticalAlign:"bottom", margin:"15px"}}
        onClick={() => arrayHelpers.push('')}
        >
        Add Rule
    </button>
    </Tooltip>
    </React.Fragment>
)} />
</div>
  )}