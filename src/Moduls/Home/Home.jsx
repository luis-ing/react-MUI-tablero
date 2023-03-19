import React from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';


const Home = () => {
    console.log("Renderizado Home");
    console.log(localStorage.getItem("Auth"));
    return (
        <Box>
            <Card elevation={0}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
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
            </Card>
            <Card sx={{ maxWidth: 345, mt: 2 }} elevation={0}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="https://source.unsplash.com/random"
                    title="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Box>
    )
}

export default Home;