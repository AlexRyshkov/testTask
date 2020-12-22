import React, {useEffect, useState} from 'react';
import {GetUsers} from "../Api";

export function UsersList() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        (async () => {
            let response = await GetUsers();
            let data = await response.json();
            setUsers(data);
            console.log(data);
        })();
    }, []);
    return (<ul>
        {users && users.map(user => <li>{user.email}</li>)}
    </ul>);
}