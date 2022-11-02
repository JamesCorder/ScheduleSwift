import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Logo from '../ScheduleSwift logo.png';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                ScheduleSwift
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme({
    palette: {
        primary: {
            light: '#6b5e51',
            main: '#694a2e',
            dark: '#292018',
        },
        secondary: {
            main: '#b71c1c',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
    },
});

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [usernameStatus, setUsernameStatus] = useState('');
    const [businessNameStatus, setBusinessNameStatus] = useState('');
    const checkPasswords = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
        } else {
            setError(null);
        }
    }

    const makeUniqueID = (length) => {
        // Reference to ran string https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const uniqueConfirmCode = makeUniqueID(8);

    const onSubmit = (event) => {
        event.preventDefault();
        setUsernameStatus('');
        setBusinessNameStatus('');
        const data = new FormData(event.currentTarget);
        if (error !== "Passwords do not match!") {
            Axios.post("http://localhost:3001/api/managerRegister", {
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                username: data.get('username'),
                email: data.get('email'),
                business: data.get('business'),
                password: data.get('password'),
                confirmCode: uniqueConfirmCode
            }).then((result) => {
                if (result.data.message) {
                    if (result.data.message === "Username has already been taken") {
                        setUsernameStatus("This username has already been taken.");
                    } else if (result.data.message === "Business name has already been taken") {
                        setBusinessNameStatus("This business name has already been taken.");
                    }                
                } else {
                    var endTime = new Date();
                    endTime.setMinutes((endTime.getMinutes() + 1));
                    // if (endTime.getMinutes() < 10) {
                    //     endTime.setHours(startTime.getHours() + 1);
                    // } else {
                    // endTime.setHours(startTime.getHours());
                    // }
                    navigate("/managerConfirmAccount", {
                        state: {
                            username: data.get('username'),
                            password: data.get('password'),
                            businessName: data.get('business'),
                            email: data.get('email'),
                            firstName: data.get('firstName'),
                            confirmCode: uniqueConfirmCode,
                            endTime: endTime,
                        }
                    });
                    console.log({
                        firstName: data.get('firstName'),
                        lastName: data.get('lastName'),
                        username: data.get('username'),
                        email: data.get('email'),
                        password: data.get('password'),
                    });
                }
            })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={Logo} alt="Logo"/>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Manager Sign up
                    </Typography>
                    <Box component="form" validate="true" onSubmit={onSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />
                            </Grid>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{usernameStatus}</Typography>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="business"
                                    label="Business Name"
                                    name="business"
                                    autoComplete="business"
                                />
                            </Grid>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{businessNameStatus}</Typography>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="confirmPassword"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={checkPasswords}
                                />
                            </Grid>
                        </Grid>
                        <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2"><p>{error}</p></Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/managerSignIn" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
export default CustomerRegister;