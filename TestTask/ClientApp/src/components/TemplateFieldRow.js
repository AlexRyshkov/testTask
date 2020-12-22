import {Form} from "react-bootstrap";
import {SelectTypes} from "./SelectTypes";
import React from "react";
import {FieldTypeToStringLocale} from "../Helpers";

export function TemplateFieldRow({field, index, isSelected, onFieldChange, onSelectedFieldChanged, isCreateMode}) {
    return <tr className={isSelected ? "table-active" : ""} onClick={() => onSelectedFieldChanged(index)}>
        <td>{index + 1}</td>
        <td>
            <Form.Control type="text" placeholder="введите название..." value={field.name}
                          onChange={e => onFieldChange(index, {...field, name: e.target.value})}/></td>
        <td>
            {isCreateMode ? <Form.Control as="select" value={field.type}
                                          onChange={e => onFieldChange(index, {
                                              ...field,
                                              type: e.target.value
                                          })}><SelectTypes/>
            </Form.Control> : FieldTypeToStringLocale(field.type)}

        </td>
    </tr>;
}