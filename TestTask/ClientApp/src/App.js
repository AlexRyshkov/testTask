import React, {useEffect, useState} from 'react';
import {Route, Router} from 'react-router';
import {Layout} from './components/Layout';
import {Login} from './components/Login';
import {CreateApplicationTemplate} from './components/CreateApplicationTemplate';
import {EditApplicationTemplates} from './components/EditApplicationTemplates';
import {createBrowserHistory} from "history";

import './custom.css'
import {CreateUser} from "./components/CreateUser";
import {CreateApplication} from "./components/CreateApplication";
import {ValidateToken} from "./Api";
import {setCookie} from "./Helpers";
import {UsersList} from "./components/UsersList";
import {ApplicationsList} from "./components/ApplicationsList";

const history = createBrowserHistory();

export default function App() {
    const [isLogged, setIsLogged] = useState(null);
    useEffect(() => {
        (async () => {
            let response = await ValidateToken();
            setIsLogged(response.status === 200);
        })();
    });

    if (isLogged === null) {
        return <React.Fragment></React.Fragment>;
    }

    if (!isLogged && history.pathname !== "/login") {
        history.push("/login");
    }

    function onLogin() {
        setIsLogged(true);
        history.push("/");
    }

    function onLogout() {
        setCookie('accessToken', null);
        setCookie('username', null);
        setCookie('role', null);
        setIsLogged(null);
    }

    return (
        <Router history={history}>
            <Layout onLogout={onLogout} isLogged={isLogged}>
                <Route exact path='/login'>
                    <Login onLogin={onLogin}/>
                </Route>
                <Route exact path='/applications' component={ApplicationsList}/>
                <Route exact path='/applications/create' component={CreateApplication}/>
                <Route exact path='/templates/create' component={CreateApplicationTemplate}/>
                <Route exact path='/templates/edit' component={EditApplicationTemplates}/>
                <Route exact path='/users/create' component={CreateUser}/>
                <Route exact path='/users' component={UsersList}/>
            </Layout>
        </Router>
    );
}
