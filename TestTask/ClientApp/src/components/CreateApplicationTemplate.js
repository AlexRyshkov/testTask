import React from 'react';
import {ApplicationTemplateEditor} from "./ApplicationTemplateEditor";
import {Col, Row} from "react-bootstrap";

export function CreateApplicationTemplate() {
    return (<Row className="flex-grow-1">
        <Col className="col-fill-height">
            <h2 style={{marginTop: 20}}>Создание шаблона заявки</h2>
            <ApplicationTemplateEditor/>
        </Col>
    </Row>);
}