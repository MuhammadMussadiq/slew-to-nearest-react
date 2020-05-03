import React, { Fragment } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const TabHeader = ({ index, changeHandler }) => {

    return (
        <Fragment>
            <Tabs
                value={index ? index : 0}
                onChange={changeHandler}
                indicatorColor="secondary"
                textColor="secondary"
                centered>

                <Tab label="Camera Management" />
                <Tab label="Slew To Nearest" />
            </Tabs>
        </Fragment>
    );
}

export default TabHeader;