import React, {useState} from 'react';
import {Alert, Button, Card, Col, Form, Row} from 'react-bootstrap';
import {AddUser} from "../Api";

export function CreateUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userRole, setUserRole] = useState("client");
    const [currentErrors, setCurrentErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    async function onCreateUserClick(e) {
        e.preventDefault();
        if (!isInputValid()) {
            return;
        }
        const response = await AddUser({
            Email: email,
            Password: password,
            Role: userRole
        });
        if (response.status === 500) {
            setCurrentErrors(["Ошибка на стороне сервера, обратитесь в службу поддержки"])
        }
        if (response.status === 400) {
            let errors = [];
            let data = await response.json();
            if (data["errors"]) {
                for (let key in data["errors"]) {
                    if (data["errors"].hasOwnProperty(key)) {
                        errors.push(data["errors"][key]);
                    }
                }
            }
            setCurrentErrors(errors);
        }
        if (response.status === 201) {
            let user = await response.json();
            setSuccessMessage(`Пользователь "${user.email}" успешно добавлен`);
        }
    }

    function isInputValid() {
        let errors = []
        if (!validateEmail()) {
            errors.push("Некорректный формат почты");
        }
        if (!validatePassword()) {
            errors.push("Короткий пароль (минимум 8 символов)");
        }
        setCurrentErrors(errors);
        return errors.length === 0;
    }

    function validateEmail() {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validatePassword() {
        return password.length >= 8;
    }

    return (
        <Row>
            <Col>
                <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Card style={{width: 480}}>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Введите email..." value={email}
                                                  onChange={(e) => setEmail(e.target.value)}/>
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control type="password" placeholder="Введите пароль..." value={password}
                                                  onChange={(e) => setPassword(e.target.value)}/>
                                </Form.Group>
                                <Form.Group controlId="userType">
                                    <Form.Label>Тип пользователя</Form.Label>
                                    <Form.Control as="select" value={userRole}
                                                  onChange={(e) => setUserRole(e.target.value)}>
                                        <option value="client">Клиент</option>
                                        <option value="admin">Администратор</option>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" type="submit"
                                        onClick={onCreateUserClick}>Создать пользователя</Button>
                                <div style={{marginTop: 20}}>
                                    {successMessage.length > 0 &&
                                    <Alert variant="success" onClose={() => setSuccessMessage("")}
                                           dismissible>
                                        {successMessage}
                                    </Alert>
                                    }
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
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Col>
        </Row>
    );
}