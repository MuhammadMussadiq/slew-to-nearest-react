import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select, Button, Typography, IconButton, Box, FormHelperText } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { isEmpty } from './../../utils/utils';
import { RemoveCircle as RemoveCircleIcon } from '@material-ui/icons';
import axios from 'axios';
import { point, nearestPoint, featureCollection, bearing, bearingToAzimuth } from '@turf/turf';

//Styles
const useStyles = makeStyles((theme) => ({
    inputComponent: {
        width: '100%'
    },
    fieldContainer: {
        padding: '8px 0px',
    },
    root: {
        padding: '25px 15%',
    },
    divider: {
        marginTop: '15px',
        marginBottom: '15px'
    },
    addButton: {
        marginTop: '15px'
    },
    removeButton: {
        fontSize: '30px',
        color: theme.palette.error.main
    },
    pointHeading: {
        marginTop: '25px',
        color: theme.palette.warning.main
    },
    box: {
        textAlign: 'center',
        paddingTop: '25px'
    }
}));

const SlewToNearest = ({ cameras, tabChangeHandler, toastOpenHandler }) => {

    //Initial States
    const classes = useStyles();
    const [selectedCameraId, setSelectedCameraId] = React.useState('');
    const [latitude, setLatitude] = React.useState('');
    const [longitude, setLongitude] = React.useState('');
    const [currentPoint, setCurrentPoint] = React.useState({
        latitude: '',
        longitude: ''
    });
    const [nearestCalculatedPoint, setNearestCalculatedPoint] = React.useState({});
    const [errorMsg, setErrorMsg] = React.useState({});
    const [points, setPoints] = React.useState([]);
    const [azimuth, setAzimuth] = React.useState('');



    /**
     * Values change handler for fields
     * @param {} event 
     */
    const changeHandler = async (event) => {
        const targetEle = event.target.name;
        const value = event.target.value;

        if (targetEle === 'latitude' || targetEle === 'longitude') {
            errorMsg[targetEle] = '';
            setCurrentPoint({
                ...currentPoint,
                [targetEle]: value
            });
        } else {
            //here value will be camera ID
            const camera = await getCameraById(value);
            setSelectedCameraId(value);
            setLatitude(camera.latitude);
            setLongitude(camera.longitude);
        }


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
            toastOpenHandler(`Something went wrong! ${error}`, 'error');
        }
    }

    /**
     * Responsible to add dynamic point data
     */
    const addPointHandler = () => {
        const errorMsg = {};
        const regex = /^(-?\d+(\.\d+)?)$/;
        if (!currentPoint.latitude || currentPoint.latitude.length === 0) {
            errorMsg.latitude = 'Latitude is required';
        } else if (!regex.test(currentPoint.latitude)) {
            errorMsg.latitude = 'Invalid value. Only decimal format is allowed';
        }
        if (!currentPoint.longitude || currentPoint.longitude.length === 0) {
            errorMsg.longitude = 'Longitude is required';
        } else if (!regex.test(currentPoint.longitude)) {
            errorMsg.longitude = 'Invalid value. Only decimal format is allowed';
        }

        setErrorMsg(errorMsg);

        if (isEmpty(errorMsg)) {
            points.push({ ...currentPoint });
            setCurrentPoint({
                latitude: '',
                longitude: ''
            });
        }

    }
    /**
     * responsible to remove any existing point
     * @param {} index 
     */
    const removePointHandler = (index) => {
        points.splice(index, 1);
        setPoints([...points]);
    }

    /**
     * Markup for single dynamic point object
     */
    const addedPoints = points.map((point, index) =>
        <Grid container justify='center' className={classes.fieldContainer} spacing={2} key={index}>
            <Grid item >
                <TextField label="Latitude" name='latitude' className={classes.inputComponent}
                    disabled
                    value={point.latitude} />
            </Grid>
            <Grid item>
                <TextField label="Longitude" name='longitude' className={classes.inputComponent}
                    disabled
                    value={point.longitude} />
            </Grid>
            <Grid item>
                <IconButton color='secondary' variant='contained' onClick={() => removePointHandler(index)}>
                    <RemoveCircleIcon className={classes.removeButton} />
                </IconButton>
            </Grid>
        </Grid>
    );

    /**
     * Populating available cameras dropdown based on data received in props
     */
    const cameraDropDownItems = cameras.map((camera, index) => (
        <MenuItem key={index} value={camera.id}>{`${camera.cameraName} - ${camera.cameraType}`}</MenuItem>
    ))

    /**
     * NOTE: External library [https://turfjs.org/] is used for caluculations
     * This function will calculate the following
     * - calculate the nearest coordinates to camera location from list of coordinates
     * - calculate the azimuth angle w.r.t nearest point
     * - set these to there corresponding state attributes
     */
    const calculateNearestPointHandler = () => {
        // Note order: longitude, latitude.
        const cameraPoint = point([longitude, latitude]);
        //converting coordinates into turf points array
        const pointsArray = points.map(pointObj => point([pointObj.longitude, pointObj.latitude]));
        const candidatesForNearestPoint = featureCollection(pointsArray);

        //Finding nearest point to camera point
        const nearest = nearestPoint(cameraPoint, candidatesForNearestPoint);
        if (nearest) {
            setNearestCalculatedPoint({
                latitude: nearest.geometry.coordinates[1], //1 is latitude
                longitude: nearest.geometry.coordinates[0] //0 is latitude
            });
            const result = bearing(cameraPoint, nearest);
            setAzimuth(bearingToAzimuth(result).toFixed(2));
        }

    }

    /**
     * Update the azimuth value in the database
     */
    const updateAzimuthHandler = () => {
        const payload = {
            id: selectedCameraId,
            azimuth: azimuth
        }
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/camera/update`, payload)
            .then((response) => {
                tabChangeHandler(null, 0);
                toastOpenHandler("Azimuth angle has been updated successfully");
            })
            .catch((err) => {
                console.log(err);
                toastOpenHandler(`Something went wrong! ${err}`, 'error');
            });
    }
    return (
        <div className={classes.root}>
            <Grid container >
                <Grid item item xs={12} className={classes.fieldContainer}>
                    <FormControl className={classes.inputComponent}>
                        <InputLabel id="camera-type-label">Camera Name</InputLabel>
                        <Select labelId="camera-type-label" value={selectedCameraId} onChange={changeHandler}>
                            {cameraDropDownItems}
                        </Select>
                        {selectedCameraId ? null :
                            <FormHelperText>{'Please select the camera from dropdown'}</FormHelperText>
                        }
                    </FormControl>
                </Grid>

                <Grid container item xs={12} className={classes.fieldContainer}>
                    <Grid item xs={12} sm={6} style={{ paddingRight: "10px" }}>
                        <TextField label="Latitiude" className={classes.inputComponent} value={latitude} disabled />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ paddingLeft: "10px" }}>
                        <TextField label="Longitude" className={classes.inputComponent} value={longitude} disabled />
                    </Grid>
                </Grid>

                <Grid container item xs={12} className={classes.fieldContainer} justify='center'>
                    <Typography variant='subtitle2' className={classes.pointHeading}>Please add points by using the ADD button.</Typography>
                    <Grid container item xs={12} spacing={4}>
                        <Grid item xs={5}>
                            <TextField label="Latitiude" name='latitude' className={classes.inputComponent}
                                error={errorMsg.latitude ? true : false}
                                helperText={errorMsg.latitude ? errorMsg.latitude : 'Valid format: 24.345'}
                                onChange={changeHandler}
                                value={currentPoint.latitude} />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField label="Longitude" name='longitude' className={classes.inputComponent}
                                error={errorMsg.longitude ? true : false}
                                helperText={errorMsg.longitude ? errorMsg.longitude : 'Valid format: 24.345'}
                                onChange={changeHandler}
                                value={currentPoint.longitude} />
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="secondary" size='small' className={classes.addButton} onClick={addPointHandler}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {points.length > 0 ?
                    <Grid container item xs={12} justify='center' className={classes.fieldContainer}>
                        <Typography variant='subtitle2' className={classes.pointHeading}>List of added points</Typography>
                        {addedPoints}
                    </Grid>
                    : null
                }
            </Grid>

            <Box className={classes.box}>
                <Button color='secondary' variant='contained'
                    disabled={!points.length}
                    style={{ marginTop: '15px', marginBottom: '15px' }}
                    onClick={calculateNearestPointHandler}>
                    Click To Slew
                </Button>
            </Box>
            {
                !isEmpty(nearestCalculatedPoint) ?
                    <Alert severity="success" className={classes.alert}>
                        <AlertTitle>Calculated Information</AlertTitle>
                        <Typography variant='subtitle2'>
                            Nearest point w.r.t camera location is: <strong> [latitude: {nearestCalculatedPoint.latitude}, longitude: {nearestCalculatedPoint.longitude}]</strong>
                        </Typography>
                        {/* <br /> */}
                        <Typography variant='subtitle2' >
                            Azimuth angle w.r.t nearest location is: <strong> [{azimuth}]</strong>
                        </Typography>
                        <Typography variant='subtitle2' >
                            To update the new azimuth angle for selected camera in database. Use below button
                        </Typography>
                        <Box style={{ textAlign: 'center' }}>
                            <Button variant="outlined" color="secondary" size='small' className={classes.addButton} onClick={updateAzimuthHandler}>
                                Update Azimuth
                        </Button>
                        </Box>
                    </Alert>
                    : null
            }


        </div>
    );
}

export default SlewToNearest;