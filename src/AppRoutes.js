import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';

const AppRoutes = () => (
    <Switch>
        <Route path={'/'} exact component={Home} />
        <Route path='/' render={() => <h3>404 Not Found</h3>} />
    </Switch>
)

export default AppRoutes;