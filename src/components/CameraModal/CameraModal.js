import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, Select, MenuItem, InputLabel, Typography, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { isEmpty } from './../../utils/utils';
import axios from 'axios';

//Styles
const useStyles = makeStyles((theme) => ({
    inputComponent: {
        width: '100%'
    },
    fieldContainer: {
        padding: '8px 15px',
    },
    modalFooter: {
        padding: '15px',
        justifyContent: 'center'
    },
    headingContainer: {
        display: 'flex',
        paddingTop: '1rem',
        paddingBottom: '0.5rem'
    },
    heading: {
        display: 'inline-block',
        flexGrow: 1
    }
}));


const CameraModal = ({ openModal, closeHandler, cameraObj, toastOpenHandler }) => {

    //Initial states
    const classes = useStyles();
    const [state, setState] = React.useState({
        ...cameraObj,
        errorMsg: {}
    });

    /**
     * Fields value change handler method
     * @param {*} event 
     */
    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        state.errorMsg[name] = '';
        setState({
            ...state,
            [name]: value
        });

    };


    /**
     * Responsible to validate the form
     */
    const validateForm = () => {
        const { cameraName, latitude, longitude, azimuth } = { ...state };
        const errorMsg = {};
        const regex = /^(-?\d+(\.\d+)?)$/;
        if (!cameraName || cameraName.length === 0) {
            errorMsg.cameraName = 'Name is required';
        }
        if (!latitude || latitude.length === 0) {
            errorMsg.latitude = 'Latitude is required';
        } else if (!regex.test(latitude)) {
            errorMsg.latitude = 'Invalid value. Only decimal format is allowed';
        }
        if (!longitude || longitude.length === 0) {
            errorMsg.longitude = 'Longitude is required';
        } else if (!regex.test(longitude)) {
            errorMsg.longitude = 'Invalid value. Only decimal format is allowed';
        }
        if (!azimuth || azimuth.length === 0) {
            errorMsg.azimuth = 'Azimuth is required';
        }
        return errorMsg;
    }

    /**
     * Submit form handler. 
     * Based on @isEditMode flag. updation or insertion will be done
     */
    const submitForm = () => {
        const errorMsg = validateForm();

        if (!isEmpty(errorMsg)) {
            setState({
                ...state,
                errorMsg: errorMsg
            });
            return;
        }

        const requestPayload = {
            id: state.id,
            cameraName: state.cameraName,
            cameraType: state.cameraType,
            latitude: state.latitude,
            longitude: state.longitude,
            azimuth: state.azimuth
        }
        let promise;
        const isEditMode = state.id ? true : false;
        if (isEditMode) {
            promise = axios.put(`${process.env.REACT_APP_API_BASE_URL}/camera/update`, requestPayload);
        } else {
            promise = axios.post(`${process.env.REACT_APP_API_BASE_URL}/camera/save`, requestPayload);
        }

        promise
            .then((response) => {
                closeHandler();
                toastOpenHandler(`Camera has been ${isEditMode ? 'updated' : 'saved'} successfully`);
            })
            .catch((err) => {
                console.log(err);
                toastOpenHandler(`Something went wrong! ${err}`, 'error');
            });
    }

    return (

        <Fragment>
            <form>
                <Dialog onClose={closeHandler} open={openModal} disableBackdropClick disableEscapeKeyDown>
                    <DialogTitle className={classes.headingContainer} disableTypography>
                        <Typography variant='h6' className={classes.heading}>Add New Camera</Typography>
                        <IconButton color='default' size='small' onClick={closeHandler}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container>
                            <Grid item xs={12} className={classes.fieldContainer}>
                                <TextField label="Camera Name" type="text" name="cameraName"
                                    error={state.errorMsg.cameraName ? true : false}
                                    helperText={state.errorMsg.cameraName}
                                    className={classes.inputComponent}
                                    onChange={handleChange}
                                    value={state.cameraName} />
                            </Grid>
                            <Grid item item xs={12} className={classes.fieldContainer}>
                                <FormControl className={classes.inputComponent}>
                                    <InputLabel id="camera-type-label">Camera Type</InputLabel>
                                    <Select labelId="camera-type-label" value={state.cameraType}
                                        onChange={handleChange}
                                        name="cameraType">
                                        <MenuItem value={'FRONT'}>Front</MenuItem>
                                        <MenuItem value={'BACK'}>Back</MenuItem>
                                        <MenuItem value={'EO'}>EO</MenuItem>
                                        <MenuItem value={"IR"}>IR</MenuItem>
                                        <MenuItem value={"360"}>360</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid container item xs={12}   >
                                <Grid item sm={12} lg={6} className={classes.fieldContainer}>
                                    <TextField label="Latitiude" type="text" className={classes.inputComponent}
                                        error={state.errorMsg.latitude ? true : false}
                                        helperText={state.errorMsg.latitude ? state.errorMsg.latitude : 'Valid format: 24.345'}
                                        name="latitude"
                                        onChange={handleChange}
                                        value={state.latitude} />
                                </Grid>
                                <Grid item sm={12} lg={6} className={classes.fieldContainer}>
                                    <TextField label="Longitude" type="text" className={classes.inputComponent}
                                        error={state.errorMsg.longitude ? true : false}
                                        helperText={state.errorMsg.longitude ? state.errorMsg.longitude : 'Valid format: 24.345'}
                                        name="longitude"
                                        onChange={handleChange}
                                        value={state.longitude} />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.fieldContainer}>
                                <TextField label="Azimuth" type="text"
                                    error={state.errorMsg.azimuth ? true : false}
                                    helperText={state.errorMsg.azimuth}
                                    name="azimuth"
                                    className={classes.inputComponent}
                                    onChange={handleChange}
                                    value={state.azimuth} />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>

                        <Button onClick={closeHandler} color="default" variant='contained' size='small'>Cancel</Button>

                        <Button color="secondary" variant='contained' size='small' onClick={submitForm}>{state.id ? 'Update' : 'Save'}</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </Fragment>
    );
}

export default CameraModal;