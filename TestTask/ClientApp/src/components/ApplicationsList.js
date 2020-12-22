import React, {useEffect, useState} from 'react';
import {Alert, Badge, Button, Card, Col, Form, Row} from "react-bootstrap";
import {GetApplications, GetApplicationsByUsername, GetFile, UpdateApplicationStatus} from "../Api";
import {getCookie} from "../Helpers";

export function ApplicationsList() {
    const [applications, setApplications] = useState([]);
    const [application, setApplication] = useState(null);
    const [message, setMessage] = useState(null);
    const role = getCookie("role");
    useEffect(() => {
        (async () => {
            let response = role === "Admin" ? await GetApplications() : await GetApplicationsByUsername(getCookie('username'));
            let applications = await response.json();
            setApplications(applications);
            setApplication(applications.length > 0 ? applications[0] : null);
        })();
    }, []);

    function onApplicationsSelectChange(e) {
        let selectedApplication = applications.find(a => a.id === parseInt(e.target.value));
        setApplication(selectedApplication);
    }

    function onStatusSelectChange(e) {
        let status = application.template.statuses.find(status => status.id === parseInt(e.target.value));
        setApplication({
            ...application,
            status: status
        });
    }

    async function onFieldClick(field) {
        if (field.templateField.type === "File" && field.value !== "") {
            let response = await GetFile(field.value);
            let blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', field.value);
            document.body.appendChild(link);
            link.click();
        }
    }

    async function onSaveStatusClick() {
        let response = await UpdateApplicationStatus(application.id, application.status.id);
        if (response.status === 200) {
            setMessage("статус успешно обновлён");
            setApplications(applications.map(a => a.id === application.id ? {...a, status: application.status} : a));
        } else {
            setMessage("произошла ошибка при обновлении статуса")
        }
    }

    console.log(application);
    return (<Row className="flex-grow-1">
        <Col className="col-fill-height">
            <h2 style={{marginTop: 20}}>Просмотр поданных заявок</h2>
            <Card>
                <Card.Body>
                    {applications &&
                    <Form.Group>
                        <Form.Label>Список заявок</Form.Label>
                        <Form.Control as="select" onChange={onApplicationsSelectChange}>
                            {applications.map((application, index) =>
                                <option key={index} value={application.id}>
                                    {application.template.name + ' ' + new Date(application.createdAt).toLocaleString() + " "}
                                </option>)}
                        </Form.Control>
                    </Form.Group>}
                    {application && <React.Fragment>
                        {role === "Admin" ? <Form.Group>
                            <Form.Label>Статус заявки</Form.Label>
                            <Form.Control as="select" onChange={onStatusSelectChange} style={{width: 320}}
                                          value={application.status.id}>
                                {
                                    application.template.statuses.map((status, index) =>
                                        <option key={index} value={status.id}>
                                            {status.name}
                                        </option>)
                                }
                            </Form.Control>
                            <Button style={{marginTop: 20}} onClick={onSaveStatusClick}>Обновить статус</Button>
                            {message &&
                            <div style={{marginTop: 20}}>
                                <Alert variant="primary" onClose={() => setMessage(null)}
                                       dismissible>
                                    <Alert.Heading as="h6">{message}</Alert.Heading>
                                </Alert>
                            </div>}
                        </Form.Group> : <Badge variant="primary">{application.status.name}</Badge>}
                        {application.fields.map((field, index) => <Form.Group key={index}>
                            <Form.Label>{field.templateField.name}</Form.Label>
                            <Form.Control readOnly name={field.templateField.name}
                                          value={field.value.replace(/\(.*?\)/, "")}
                                          onClick={() => onFieldClick(field)}
                            />
                        </Form.Group>)}
                    </React.Fragment>}
                </Card.Body>
            </Card>
        </Col>
    </Row>);
}