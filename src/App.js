import React, {Component, Fragment} from 'react';
import './css/App.css';
import Navbar from "./Componentes/Navbar";
import Datos from "./Componentes/Datos";
import Grafico from "./Componentes/Grafico";
import Tabla from "./Componentes/Tabla";
import Ayuda from "./Componentes/Ayuda";
import Sesion from "./Componentes/Sesion";

import {createBrowserHistory} from 'history';
import {Redirect, Route} from 'react-router';
import {Router, Switch} from 'react-router-dom'
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {firebaseAuth} from "./index";


const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: '#FF9800',
            dark: '#b26a00',
            contrastText: '#fff',
        },
        secondary: {
            main: '#fff'
        }
    },
});

class App extends Component {
    render() {
        const history = createBrowserHistory();
        return (
            <Router history={history}>
                <MuiThemeProvider theme={theme}>
                    <Switch>
                        <PrivateRoute exact path={"/"} component={Principal}/>
                        <PrivateRoute path={"/pesos"} component={Tabla}/>
                        <PrivateRoute path={"/ayuda"} component={Ayuda}/>
                        <Route path="/sesion" component={Sesion}/>
                    </Switch>
                </MuiThemeProvider>
            </Router>
        );
    }
}

class Principal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scroll: 0
        };
        this.scroll = this.scroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scroll, false);
    }


    scroll() {
        let pos = window.scrollY;
        this.setState({
            scroll: pos
        });
    }

    render() {
        return (
            <Fragment>
                <Navbar/>
                <Grafico posicion={this.state.scroll}/>
                <Datos posicion={this.state.scroll}/>
            </Fragment>
        )
    }
}

class PrivateRoute extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: firebaseAuth().currentUser
        }
    }

    componentWillMount() {
        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user
                });
            }
        });
    }

    render() {
        let isLoggedIn = this.state.user;
        if (isLoggedIn) {
            return (
                <Route path={this.props.path} component={this.props.component}/>
            )
        } else {
            return (
                <Redirect to="/sesion"/>
            )
        }
    }
}

export default App;
