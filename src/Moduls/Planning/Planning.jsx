import React from 'react';
import { NavLink } from 'react-router-dom';

const Planning = () => {
    console.log("Renderizado Planning");
    return (
        <>
            <div>Hola Planing</div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard"
                        >
                            Dashboard
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Planning;