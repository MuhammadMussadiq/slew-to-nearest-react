import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TabHeader from '../../components/TabHeader';
import { Box, Paper, Snackbar } from '@material-ui/core';
import axios from 'axios';

import CameraModal from '../../components/CameraModal'
import CameraList from '../../components/CameraList'
import SlewNearest from '../../components/SlewNearest'
import { Alert } from '@material-ui/lab';

//Styles
const useStyles = makeStyles((theme) => ({
    panel: {
        marginLeft: '15%',
        marginRight: '15%',
        background: '#fff'
    }

}));

//Default Camera Object
const getDefaultCameraObj = () => {
    return {
        id: '',
        cameraName: '',
        cameraType: 'FRONT',
        latitude: '',
        longitude: '',
        azimuth: '',
    }
}

const Home = () => {
    // Initial states
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [openModal, setOpenModal] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState('');
    const [severity, setSeverity] = React.useState('success');
    const [cameras, setCameras] = React.useState([]);
    const [camera, setCamera] = React.useState(getDefaultCameraObj());

    /**
     * Responsible to handle tab navigations
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleTabChange = (event, newValue) => {
        if (cameras.length === 0) {
            handleSnackBarOpen('Kindly add camera first to use this functionality');
            return;
        }
        setTabIndex(newValue);
        getAllCameras();
    };

    /**
     * This method will show the toast
     * @param {*} message 
     * @param {*} severity // default is success
     */
    const handleSnackBarOpen = (message, severity) => {
        setSnackbarMsg(message);
        setSeverity(severity ? severity : 'success');
        setOpenSnackbar(true);
    };

    /**
     * Responsible to close the toast
     * @param {*} event 
     * @param {*} reason 
     */
    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setSnackbarMsg('')
    };

    /**
     * Modal open handler method
     * @param {*} id 
     */
    const handleOpenModal = async (id) => {
        if (id) {
            const data = await getCameraById(id);
            setCamera(data);
        } else {
            setCamera(getDefaultCameraObj());
        }

        setOpenModal(true);
    };
    /**
     * Modal close handler method
     * @param {} event 
     */
    const handleCloseModal = (event) => {
        setOpenModal(false);
        setCamera(getDefaultCameraObj());
        getAllCameras();
    };


    /**
     * Fetch the camera from api by camera id
     * @param {*} id 
     */
    const getCameraById = async (id) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/camera/get-by-id/${id}`);
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Fetch all the available cameras from api
     */
    const getAllCameras = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/camera/get-all`);
            setCameras(result.data);
        } catch (error) {
            handleSnackBarOpen(`${error}! Please check your backend is up and running`, 'error')
        }

    }

    /**
     * working as ComponentDidMount
     */
    useEffect(() => {
        getAllCameras();
        setCamera(getDefaultCameraObj());
    }, []);


    return (
        <Box>
            <TabHeader index={tabIndex} changeHandler={handleTabChange} />
            <Paper elevation={1} className={classes.panel}>
                {openModal ?
                    <CameraModal openModal={openModal} closeHandler={handleCloseModal} cameraObj={camera} toastOpenHandler={handleSnackBarOpen} />
                    : null
                }
                {tabIndex === 0 ?
                    <CameraList cameras={cameras} openModalHandler={handleOpenModal} />
                    :
                    <SlewNearest cameras={cameras} tabChangeHandler={handleTabChange} toastOpenHandler={handleSnackBarOpen} />
                }

                {/* Toast markup */}
                <Snackbar open={openSnackbar} autoHideDuration={6000}
                    onClose={handleSnackBarClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}>
                    <Alert severity={severity} variant='filled' onClose={handleSnackBarClose}>
                        {snackbarMsg}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
}

export default Home;