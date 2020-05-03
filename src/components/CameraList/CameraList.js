import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography, Button, Divider } from '@material-ui/core';
import { AddCircleOutline as AddCircleIcon } from '@material-ui/icons';
import { Edit as EditIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        background: '#fff',
        paddingLeft: "10px",
        paddingRight: '10px'
    },
    dataNotFoundContent: {
        padding: '72px',
        textAlign: 'center',
    },
    headingContainer: {
        display: 'flex',
        paddingTop: '1rem',
        paddingBottom: '0.5rem',
    },
    heading: {
        display: 'inline-block',
        flexGrow: 1
    },
    headingButton: {
        fontSize: '2.5rem',

    },
    divider: {
        marginBottom: '0.5rem'
    },
}));

const CameraList = ({ cameras, openModalHandler }) => {

    const classes = useStyles();

    const dataNotFoundContent = (
        <Container className={classes.dataNotFoundContent}>
            <Typography variant='h6' color='secondary'>No camera found in database. You can add new camera by clicking <strong>[ADD CAMERA]</strong> button. </Typography>
        </Container>
    );

    return (
        <Fragment>
            <Container className={classes.headingContainer}>
                <Typography variant='h6' className={classes.heading}>Available Cameras</Typography>
                <Button variant="contained" color="primary" size="small" startIcon={<AddCircleIcon />} onClick={() => openModalHandler()}>Add Camera</Button>
            </Container>
            <Divider orientation="horizontal" className={classes.divider} />

            {(cameras && cameras.length > 0) ?
                <TableContainer component={Paper} className={classes.tableContainer} >
                    <Table  >
                        <TableHead >
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Type</strong></TableCell>
                                <TableCell><strong>Latitude</strong></TableCell>
                                <TableCell><strong>Longitude</strong></TableCell>
                                <TableCell><strong>Azimuth</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cameras.map((camera, index) => (
                                <TableRow key={index} hover >
                                    <TableCell>{camera.cameraName}</TableCell>
                                    <TableCell >{camera.cameraType}</TableCell>
                                    <TableCell >{camera.latitude}</TableCell>
                                    <TableCell >{camera.longitude}</TableCell>
                                    <TableCell >{camera.azimuth}</TableCell>
                                    <TableCell >
                                        <IconButton  onClick={() => openModalHandler(camera.id)}>
                                            <EditIcon color='secondary' fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                :
                dataNotFoundContent
            }
        </Fragment>
    );
}

export default CameraList;