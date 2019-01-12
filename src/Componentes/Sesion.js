import * as React from "react";
import {Component} from "react";
import GoogleButton from 'react-google-button'
import {firebaseAuth, googleProvider} from "../index";
import MDSpinner from "react-md-spinner";


class Sesion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
        };
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    componentWillMount() {

        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push("/")
            } else {
                this.setState({spinner: true});
            }
        });
    }

    handleGoogleLogin() {
        firebaseAuth().signInWithRedirect(googleProvider)
            .catch(error => alert(error))
    }

    render() {
        if (this.state.spinner) {
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
        } else {
            return (
                <div className='d-flex justify-content-center mt-5 pt-5'>
                    <MDSpinner singleColor='#FF9800' size={75} borderSize={6}/>
                </div>
            )
        }
    }
}

export default Sesion;