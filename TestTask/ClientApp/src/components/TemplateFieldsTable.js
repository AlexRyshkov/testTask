import {Table} from "react-bootstrap";
import React from "react";
import {TemplateFieldRow} from "./TemplateFieldRow";

export function TemplateFieldsTable({template, selectedFieldIndex, onFieldChange, onSelectedFieldChanged, isCreateMode}) {
    return <Table hover>
        <thead>
        <tr>
            <th>#</th>
            <th>Название поля</th>
            <th>Тип поля</th>
        </tr>
        </thead>
        <tbody>
        {template.fields.sort((f1, f2) => f1.order-f2.order).map((field, index) => <TemplateFieldRow
            key={index} field={field} index={index}
            isSelected={index === selectedFieldIndex}
            onFieldChange={onFieldChange}
            onSelectedFieldChanged={onSelectedFieldChanged} isCreateMode={isCreateMode}/>)}
        </tbody>
    </Table>;
}