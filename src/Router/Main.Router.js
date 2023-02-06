import { Route, Routes } from 'react-router-dom';
import Public from './PublicRoute';
import Login from '../Moduls/Login/';
import PrivateRoute from './private/PrivateRoute';
import Home from '../Moduls/Home/';
import Dashboard from '../Moduls/Dashboard/Dashboard';
import Planning from '../Moduls/Planning/Planning';

const Main = () => {
    console.log("Renderizado Main.Router");

    return (
        <>
            <Routes>
                <Route index path="/login" element={ <Public component={Login} /> } />
                <Route path="/">
                    <>
                        <Route index element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="planning" element={<PrivateRoute><Planning /></PrivateRoute>} />
                        <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    </>
                </Route>
            </Routes>
        </>
    );
}

export default Main;