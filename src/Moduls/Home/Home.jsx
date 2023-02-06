import React from 'react';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';


const Home = () => {
    console.log("Renderizado Home");
    console.log(localStorage.getItem("Auth"));
    return (
        <Box>
            Hola Home
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/dashboard"
                        >
                            Dashboard
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
        </Box>
    )
}

export default Home;