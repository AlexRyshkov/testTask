import React, {useEffect, useState} from 'react';
import {Alert, Button, Card, Col, Form, Row} from "react-bootstrap";
import {GetTemplates} from "../Api";
import {getCookie} from "../Helpers";

export function CreateApplication() {
    const [templates, setTemplates] = useState([]);
    const [application, setApplication] = useState({templateId: null, fields: []});
    const [message, setMessage] = useState(null);
    useEffect(() => {
        (async () => {
            let response = await GetTemplates();
            let getTemplates = await response.json();
            let currentTemplate = getTemplates.length > 0 && getTemplates[0];
            if (currentTemplate) {
                setApplication({
                    templateId: currentTemplate.id,
                    fields: currentTemplate.fields.sort((f1, f2) => f1.order - f2.order).map(field => ({
                        templateFieldId: field.id,
                        name: field.name,
                        type: field.type,
                        value: ""
                    }))
                });
            }
            setTemplates(getTemplates);
        })();
    }, []);

    function onTemplatesSelectChange(e) {
        let selectedTemplate = templates.filter(template => template.id === parseInt(e.target.value))[0];
        setApplication({
            templateId: selectedTemplate.id,
            fields: selectedTemplate.fields.sort((f1, f2) => f1.order - f2.order).map(field => ({
                templateFieldId: field.id,
                name: field.name,
                type: field.type,
                value: ""
            }))
        });
    }

    async function onSubmitApplicationClick(e) {
        const formElem = document.querySelector('#applicationForm');
        const data = new FormData(formElem);
        data.append("templateId", application.templateId);
        const res = await fetch("https://localhost:44360/api/applications", {
            headers: {
                'Authorization': `Bearer ${getCookie('accessToken')}`
            },
            method: "POST",
            body: data
        });
        let responseData = await res.json();
        if (res.status === 201) {
            setMessage("Заявка успешно создана");
        } else {
            setMessage(responseData["errors"]);
        }
    }

    return (<Row className="flex-grow-1">
        <Col className="col-fill-height">
            <h2 style={{marginTop: 20}}>Новая заявка</h2>
            <React.Fragment>
                <Card>
                    <Card.Body>
                        {templates.length > 0 &&
                        <Form.Group>
                            <Form.Label>Шаблон</Form.Label>
                            <Form.Control as="select" onChange={onTemplatesSelectChange}>
                                {templates.map((template, index) => <option key={index}
                                                                            value={template.id}>{template.name}</option>)}
                            </Form.Control>
                        </Form.Group>}
                        {application.fields.length > 0 &&
                        <Form id="applicationForm" method="POST">
                            {application.fields.map((field, index) => <Form.Group key={index}>
                                <Form.Label>{field.name}</Form.Label>
                                <Form.Control type={field.type} name={field.templateFieldId} placeholder={field.name}/>
                            </Form.Group>)}
                            <Form.Group>
                                <div>
                                    <Button onClick={onSubmitApplicationClick}>Отправить заявку</Button>
                                </div>
                                {message &&
                                <div style={{marginTop: 20}}>
                                    <Alert variant="primary" onClose={() => setMessage(null)}
                                           dismissible>
                                        <Alert.Heading as="h6">{message}</Alert.Heading>
                                    </Alert>
                                </div>}
                            </Form.Group>
                        </Form>
                        }
                    </Card.Body>
                </Card>
            </React.Fragment>
        </Col>
    </Row>);
}