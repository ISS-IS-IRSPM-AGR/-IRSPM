import React ,{useState,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Cookies from 'js-cookie';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
      Advance Gym Recommender (AGR) 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#8eb8ad',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#8eb8ad',
  },
  text: {
    outlineColor: '#8eb8ad',
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));



export default function UserDataPage() {
  const classes = useStyles();
  const username = Cookies.get('username')

  // function noop() {};
  // function GetUserData_fromUsername(username) {
  //   GetUserData_fromUsername = noop;
  //   const requestOptions = {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         username:username,
  //       }),
  //   };
  //   if (username!=''){
  //   fetch('/AGR/GetUserData', requestOptions)
  //       .then(function(response){
  //         console.log(response)
  //         if (!response.ok){
  //           throw new Error('Response not OK');
  //         }
  //         else{
  //           return response.json();
  //         }
  //       }).then(
  //         (data) => {
  //           Cookies.set('fitness_level', data.fitness_level)
  //           console.log(Cookies.get('fitness_level'))
  //           // setGoal(data.goal);
  //           // setGender(data.gender);
  //           // setIntensity(data.intensity);
  //           // setBmi(data.bmi);
  //         },
  //         // (error) => {alert(error)}
  //       )
  //     }
  //   else{
  //     // if(username=='') {alert('Username cannot be blank!')}
  //     // else if (fitness_level==''){alert('Full name cannot be blank!')}
  //   }
  // }

  // const userdata = GetUserData_fromUsername(username);



  const [fitnesslevel,setFitnesslevel] = useState(' ');
  const [gender,setGender] = useState(' ');
  const [goal,setGoal] = useState(' ');
  const [bmi,setBmi] = useState(' ');
  const [intensity,setIntensity] = useState(' ');
  let history = useHistory();
  const [userStatus, setUserStatus] = useState(-1);
  

  useEffect(() => {
    if(userStatus===0)
    {
      setUserStatus(-1);
      alert('Account has been updated!');
      history.push('/SecondHome');
    }
    else if (userStatus===1)
    {
      setUserStatus(-1);
      // setAlertShow('visible');
      // setAlertText('Username has been used!');
      alert('Username has been used!')
    }
    else if (userStatus===2){
      setUserStatus(-1);
      // setAlertShow('visible');
      // setAlertText('Not sure but cannot signup!');
      alert('Not sure but cannot signup!')
    }
  }, [userStatus])

  // function SetUserData(username,fitnesslevel,gender,goal,bmi,intensity) {
  function SetUserData(username,fitnesslevel,goal,intensity,gender,bmi) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username:username,
          gender:gender,
          fitness_level:fitnesslevel,
          goal:goal,
          bmi:bmi,
          intensity:intensity,
        }),
    };
    if (username!='' && fitnesslevel!='' && gender!='' && goal!='' && intensity!='' && bmi!=''){
    fetch('/AGR/SetUserData', requestOptions)
        .then(function(response){
          if (!response.ok){
            throw new Error('Response not OK');
          }
          else{
            return response.json();
          }
        }).then(
          (data) => {
            setUserStatus(data.status);
          },
          (error) => {alert(error)}
        )
      }
    else{
      if(bmi=='') {alert('All field must be field!')}
      else if (fitness_level==''){alert('All field must be field!')}
      else if (goal==''){alert('All field must be field!')}
      else if (gender==''){alert('All field must be field!')}
      else if (intensity==''){alert('All field must be field!')}
    }
  }
  
  const genderHandleChange = (event) => {
    setGender(event.target.value);
  };

  const fitnessHandleChange = (event) => {
    setFitnesslevel(event.target.value);
  };

  const goalHandleChange = (event) => {
    setGoal(event.target.value);
  };

  const intensityHandleChange = (event) => {
    setIntensity(event.target.value);
  };
  
  const bmiHandleChange = (event) => {
    setBmi(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountBoxIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {username}'s Profile 
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container 
          spacing={2}
          className={classes.text}
          >
            <Grid item xs={12}>
              <Typography component="body2">
                <i>Getting to know more about you </i>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
              fullWidth='true'
              className={classes.formControl}
              >
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  labelId="gender"
                  id="gender"
                  value={gender}
                  onChange={genderHandleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'M'}>Male</MenuItem>
                  <MenuItem value={'F'}>Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
              fullWidth='true'
              className={classes.formControl}
              >
                <InputLabel id="fitnesslevel">Fitness Level</InputLabel>
                <Select
                  labelId="fitnesslevel"
                  id="fitnesslevel"
                  value={fitnesslevel}
                  onChange={fitnessHandleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>Beginer</MenuItem>
                  <MenuItem value={2}>Inter</MenuItem>
                  <MenuItem value={3}>Advance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
              fullWidth='true'
              className={classes.formControl}
              >
                <InputLabel id="goal">Goal</InputLabel>
                <Select
                  labelId="goal"
                  id="goal"
                  value={goal}
                  onChange={goalHandleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>Weight Loss</MenuItem>
                  <MenuItem value={2}>Muscle Building</MenuItem>
                  <MenuItem value={3}>Get Healthy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
              fullWidth='true'
              className={classes.formControl}
              >
                <InputLabel id="intensity">Exercise Intensity</InputLabel>
                <Select
                  labelId="intensity"
                  id="intensity"
                  value={intensity}
                  onChange={intensityHandleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>Low</MenuItem>
                  <MenuItem value={1}>Low-Medium</MenuItem>
                  <MenuItem value={2}>Medium</MenuItem>
                  <MenuItem value={3}>Medium-High</MenuItem>
                  <MenuItem value={3}>High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
              fullWidth='true'
              className={classes.formControl}
              >
                <TextField
                  id="bmi"
                  label="BMI"
                  type="number"
                  step=".01"
                  min="15"
                  max="30"
                  margin="normal"
                  defaultValue="20"
                  fullWidth
                  onChange={e => setBmi(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            className={classes.submit}
            startIcon={<CloudUploadIcon />}
            onClick={() => SetUserData(username,fitnesslevel,goal,intensity,gender,bmi)}
          >
            Update My Data
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/SecondHome" variant="body2">
                Return HOME
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}