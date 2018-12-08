import React, {Fragment} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Link from "react-router-dom/es/Link";
import '../css/Navbar.css'
import {firebaseAuth} from "../index";

class Navbar extends React.Component {
    state = {
        anchorEl: null,
    };


    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    handleCerrarSesion = () => {
        firebaseAuth().signOut().then(function () {
        }, function (error) {
            console.error('Sign Out Error', error);
        });
        this.setState({anchorEl: null});
    };


    render() {
        const {anchorEl} = this.state;
        return (
            <Fragment>
                <AppBar className='appbar' position="fixed" color='primary'>
                    <Toolbar className='d-flex flex-row justify-content-between toolbar'>
                        <Titulo/>
                        <IconButton
                            onClick={this.handleClick}
                            aria-owns={anchorEl ? 'long-menu' : null}
                            aria-haspopup="true"
                            aria-label="More"
                            color="secondary">
                            <MoreVertIcon/>
                        </IconButton>
                    </Toolbar>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}>
                        <Link to={'/pesos'}><MenuItem onClick={this.handleClose}>Mis pesos</MenuItem></Link>
                        <Link to={'/ayuda'}><MenuItem onClick={this.handleClose}>Ayuda</MenuItem></Link>
                        <Link to={'/sesion'}><MenuItem onClick={this.handleCerrarSesion}>Cerrar Sesión</MenuItem></Link>
                    </Menu>
                </AppBar>
                <div className='navbar'/>
            </Fragment>
        );
    }
}

const Titulo = () => {
    let url = window.location.href;
    if (!url.includes("pesos") && !url.includes("ayuda") && !url.includes("sesion")) {
        return (
            <Typography style={{marginLeft: "48px"}} className='texto-navbar' variant="h6" color="inherit">
                MiBascula
            </Typography>
        )
    } else {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <Link to={'/'}>
                    <IconButton
                        className='texto-navbar'
                        aria-haspopup="true"
                        aria-label="More"
                        color="secondary">
                        <ArrowBackIcon/>
                    </IconButton>
                </Link>
                <Typography className='texto-navbar' variant="h6" color="inherit">
                    MiBascula
                </Typography>
            </div>
        );
    }
};


export default Navbar;