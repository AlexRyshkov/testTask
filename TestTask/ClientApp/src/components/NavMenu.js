import React from 'react';
import {Button, Nav, NavDropdown} from "react-bootstrap";
import {getCookie} from "../Helpers";
import {useHistory} from "react-router-dom";

export function NavMenu({onLogout}) {
    const history = useHistory();
    const isAdmin = getCookie("role") === "Admin";
    return <Nav className="justify-content-end">
        {isAdmin &&
        <NavDropdown title="Пользователи" id="users">
            <NavDropdown.Item onClick={() => history.push("/users/create")}>Создание пользователей</NavDropdown.Item>
            <NavDropdown.Item onClick={() => history.push("/users")}>Просмотр пользователей</NavDropdown.Item>
        </NavDropdown>
        }
        <NavDropdown title="Заявки" id="applications">
            {isAdmin &&
            <React.Fragment>
                <NavDropdown.Item onClick={() => history.push("/templates/create")}>Создание шаблонов
                    заявок</NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push("/templates/edit")}>Изменение шаблонов
                    заявок</NavDropdown.Item>
            </React.Fragment>
            }
            <NavDropdown.Item onClick={() => history.push("/applications")}>Просмотр заявок</NavDropdown.Item>
            {!isAdmin &&
            <NavDropdown.Item onClick={() => history.push("/applications/create")}>Создание заявки</NavDropdown.Item>
            }
        </NavDropdown>
        <Nav.Item>
            <Button disabled variant="light">{getCookie("username")}</Button>
        </Nav.Item>
        <Nav.Item>
            <Button disabled variant="light">{getCookie("role") === "Client" ? "Клиент" : "Администратор"}</Button>
        </Nav.Item>
        <Nav.Item>
            <Button variant="light" onClick={onLogout}>Выйти</Button>
        </Nav.Item>
    </Nav>
}
