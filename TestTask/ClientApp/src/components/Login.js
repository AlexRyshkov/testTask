import React, {useState} from 'react';
import {Alert, Button, Card, Col, Form, Row} from 'react-bootstrap';
import {TryLogin} from "../Api";
import {setCookie} from "../Helpers";

export function Login({onLogin}) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [currentErrors, setCurrentErrors] = useState([]);

    async function onLoginClick(e) {
        e.preventDefault();
        let response = await TryLogin(login, password);
        let data = await response.json();
        if (response.status === 200) {
            setCookie('accessToken', data.accessToken);
            setCookie('username', data.username);
            setCookie('role', data.role);
            onLogin();
        } else if (response.status === 500) {
            setCurrentErrors(["Ошибка на стороне сервера, обратитесь в службу поддержки"])
        } else if (response.status === 400) {
            let errors = [];
            if (data["errors"]) {
                for (let key in data["errors"]) {
                    if (data["errors"].hasOwnProperty(key)) {
                        errors.push(data["errors"][key]);
                    }
                }
            }
            setCurrentErrors(errors);
        }
    }

    return (
        <Row>
            <Col>
                <div style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Card style={{width: 560}} className="text-center">
                        <Card.Body>
                            <h2>Вход в систему</h2>
                            <Form>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Введите email..." value={login}
                                                  onChange={(e) => setLogin(e.target.value)}/>
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control type="password" placeholder="Введите пароль..." value={password}
                                                  onChange={(e) => setPassword(e.target.value)}/>
                                </Form.Group>
                                <Button variant="primary" type="submit"
                                        onClick={onLoginClick}>Войти</Button>
                            </Form>
                            <div style={{marginTop: 20}}>
                                {currentErrors.length > 0 &&
                                <Alert variant="danger" onClose={() => setCurrentErrors([])}
                                       dismissible>
                                    <Alert.Heading as="h6">Ошибка</Alert.Heading>
                                    <ul>
                                        {currentErrors.map((error, index) => <li
                                            key={index}>{error}</li>)}
                                    </ul>
                                </Alert>
                                }
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Col>
        </Row>
    );
}