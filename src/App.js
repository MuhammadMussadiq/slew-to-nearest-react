import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import './App.css';
import { CssBaseline, Paper } from '@material-ui/core';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';


const theme = createMuiTheme({
  palette: {
    background: {paper: "#f5f5f5", default: "#f5f5f5"}
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper elevation={0} style={{ paddingBottom: '5%' }}>
        <Navbar />
        <Router>
          <AppRoutes />
        </Router>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
