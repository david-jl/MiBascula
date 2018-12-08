import * as React from "react";
import {Component} from "react";
import GoogleButton from 'react-google-button'
import {firebaseAuth, googleProvider} from "../index";


class Sesion extends Component {
    constructor(props) {
        super(props);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    componentWillMount() {
        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push("/")
            }
        });
    }

    handleGoogleLogin() {
        firebaseAuth().signInWithRedirect(googleProvider)
            .catch(error => alert(error))
    }

    render() {
        return (
            <div className='d-flex flex-column justify-content-around align-items-center completo container'>
                <h1 style={{color: "gray"}}>MiBascula</h1>
                <GoogleButton
                    style={{border: "0.5px solid #DADADA"}}
                    type='light'
                    label='Iniciar sesión'
                    onClick={this.handleGoogleLogin}
                />
                <p className='footer-sesion'>Empieza a perder peso de manera inteligente</p>
            </div>
        );
    }
}

export default Sesion;