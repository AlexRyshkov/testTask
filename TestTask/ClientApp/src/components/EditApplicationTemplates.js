import React from 'react';
import {ApplicationTemplateEditor} from "./ApplicationTemplateEditor";
import {Col, Row} from "react-bootstrap";

export function EditApplicationTemplates() {
    return (<Row className="flex-grow-1">
        <Col className="col-fill-height">
            <h2 style={{marginTop: 20}}>Изменение шаблона заявки</h2>
            <ApplicationTemplateEditor
                template={{name: "", fields: [], statuses: ["заявка одобрена", "заявка отклонена"]}}/>
        </Col>
    </Row>);
}