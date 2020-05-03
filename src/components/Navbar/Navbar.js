import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Camera as CameraIcon} from '@material-ui/icons';

//Styles
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        fontSize: '2.5rem',

    },
    title: {
        flexGrow: 1,
    },
}));

const Navbar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color='secondary' >
                        <CameraIcon className={classes.menuButton}/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Camera Slew To Nearest
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Navbar;
