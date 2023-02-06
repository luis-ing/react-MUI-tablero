import { useState, useContext } from 'react';
import {
  Button, TextField, Grid, Card,
  Typography, FormControl, InputLabel, OutlinedInput,
  InputAdornment, IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from "react-hook-form";
import { useLazyQuery } from '@apollo/client';
import LoginUsuario from './Login.graphql';
import { AuthContext } from '../../App';

const Login = ({ login, setauth }) => {
  const Auth = useContext(AuthContext);
  const [values, setValues] = useState({
    showPassword: false
  });
  const [textLogin, setTextLogin] = useState({ 'title': 'LOGIN', 'inactive': false });
  const { control, handleSubmit, formState: { errors } } = useForm();
  const auth = () => {
    setauth(values);
    login(values);
  }

  const [SendDataLogin, { loading, error, data }] = useLazyQuery(LoginUsuario, {
    onCompleted: (response) => {
      // console.log(response.LoginUsuario.data);
      // console.log(response.LoginUsuario.mng);
      if (response.LoginUsuario.code === 1) {
        // console.log(JSON.parse(response.LoginUsuario.mng));
        localStorage.setItem("Auth", response.LoginUsuario.mng);
        localStorage.setItem("Token", response.LoginUsuario.data);
        Auth.setAuth(JSON.parse(response.LoginUsuario.mng));
      }
    },
    onError: (errorData) => {
      console.error(errorData);
    }
  });

  // const inputChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = ({ password, username }) => {
    try {
      setTextLogin({ 'title': 'Loading...', 'inactive': true });
      console.log(password, username);
      if (password && username) {
        setTimeout(() => {
          SendDataLogin({ variables: { password, username } });
          setTextLogin({ 'title': 'LOGIN', 'inactive': false });
        }, 1000);
      } else {
        setTextLogin(textLogin.title = 'LOGIN', textLogin.inactive = false);
      }
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', backgroundColor: '#f6f6f6' }}>
        <Card sx={{ width: '80%', height: '80%', borderRadius: '10px' }} >
          <Grid container sx={{ height: '100%', flexWrap: 'wrap', alignContent: 'center' }}>
            <Grid item xs={12} md={6}
              sx={{ paddingRight: 6, paddingLeft: 6, display: 'flex', alignItems: 'center' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Typography gutterBottom variant="h4" component="div" textAlign="center">
                  Welcome to Lizard
                </Typography>
                <Typography gutterBottom variant="button" component="div" textAlign="center">
                  Sign In
                </Typography>
                <Controller
                  control={control}
                  name="username"
                  rules={{ required: true }}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Username"
                      name='username'
                      value={value || ''}
                      onChange={onChange}
                      error={error ? true : false}
                      helperText={error && "Incorrect entry."}
                      fullWidth
                      sx={{ marginTop: 1, marginBottom: 1 }}
                    />
                  )}
                />
                <FormControl sx={{ width: '100%', marginTop: 1, marginBottom: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <Controller
                    control={control}
                    name="password"
                    rules={{ required: true }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={value || ''}
                        error={error ? true : false}
                        onChange={onChange}
                        name='password'
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    )}
                  />

                </FormControl>
                <Button
                  type='submit'
                  color='primary'
                  variant='contained'
                  fullWidth
                  sx={{ marginTop: 1, marginBottom: 1 }}
                  disabled={textLogin.inactive}
                >
                  {textLogin.title}
                </Button>
              </form>
            </Grid>
            <Grid item xs={0} md={6}
              sx={{
                background: 'linear-gradient(blue, pink)',
                height: '100%',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://source.unsplash.com/random)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  )
}

export default Login;