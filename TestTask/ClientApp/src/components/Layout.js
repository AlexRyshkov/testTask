import React from 'react';
import {Container} from 'react-bootstrap';
import {NavMenu} from './NavMenu';

export function Layout({children, onLogout, isLogged}) {
    return (
        <div>
            {isLogged && <NavMenu onLogout={onLogout}/>}
            <Container>
                {children}
            </Container>
        </div>
    );
}
