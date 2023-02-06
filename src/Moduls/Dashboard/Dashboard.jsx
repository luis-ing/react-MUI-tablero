import React from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    console.log("Renderizado Dashboard");
    return (
        <>
            <div>Hola Dashboard</div>
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
                            to="/planning"
                        >
                            Planning
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Dashboard;