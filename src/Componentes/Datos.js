import React, {Component} from 'react';
import firebase from 'firebase'
import {isMobile} from 'react-device-detect';
import Button from '@material-ui/core/Button';
import '../css/Datos.css'
import {firebaseAuth} from "../index";

class Datos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vacioDia: false,
            vacioPeso: false,
            height: window.innerHeight
        };
        this.handleEnviar = this.handleEnviar.bind(this);
        this.handleOnChangeDia = this.handleOnChangeDia.bind(this);
        this.handleOnChangeObservaciones = this.handleOnChangeObservaciones.bind(this);
        this.handleObservaciones = this.handleObservaciones.bind(this);
    }

    handleWindowSizeChange = () => {
        this.setState({
            vacioDia: this.state.vacioDia,
            vacioPeso: this.state.vacioPeso,
            height: window.innerHeight
        });
    };

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleOnChangeObservaciones(texto) {
        this.inputObs.value = texto.value.substring(0, 26);
    }

    handleObservaciones(texto) {
        this.inputObs.value = texto;
    }

    handleEnviar() {
        let aux = false;
        if (this.inputDia.value === "") {
            this.setState({
                vacioDia: true,
                vacioPeso: this.state.vacioPeso,
                height: window.innerHeight
            });
            aux = true;
        }
        if (this.inputPeso.value === "" || this.inputPeso.value < 0) {
            this.setState({
                vacioDia: aux,
                vacioPeso: true,
                height: window.innerHeight
            });
            aux = true;
        }
        if (this.inputPeso.value !== "" && this.inputDia.value !== "") {
            window.scrollTo(0, 0);
            setTimeout(() => {
                if (aux)
                    return;
                let fecha = this.inputDia.value.substring(0, 4) + "/" + this.inputDia.value.substring(5, 7) + "/" + this.inputDia.value.substring(8, 10);
                let ruta_fecha = fecha.substring(0, 7);
                let refPush = firebase.database().ref('/datos/' + firebaseAuth().getUid() + "/" + ruta_fecha).push();
                let actualizado = false;
                firebase.database().ref('/datos/' + firebaseAuth().getUid() + "/" + ruta_fecha).on('child_added', snapshot => {
                    if (snapshot.exists()) {
                        if (this.inputDia.value.substring(8, 10) === snapshot.val().dia.substring(8, 10)) {
                            firebase.database().ref().child('datos/' + firebaseAuth().getUid() + "/" + ruta_fecha + "/" + snapshot.val().id).update({peso: this.inputPeso.value});
                            actualizado = true;
                        }
                    }
                });
                let data = {
                    dia: fecha,
                    peso: this.inputPeso.value,
                    observacion: this.inputObs.value,
                    id: refPush.key
                };
                if (!actualizado)
                    refPush.set(data);
                this.inputDia.value = '';
                this.inputPeso.value = '';
                this.inputObs.value = '';
            }, 600);
        }
    }

    handleOnChangeDia() {
        this.setState({
            vacioDia: false,
            vacioPeso: this.state.vacioPeso,
            height: window.innerHeight
        })
    }

    handleOnChangePeso(texto) {
        this.inputPeso.value = texto.value.substring(0, 6);
        this.setState({
            vacioDia: this.state.vacioDia,
            vacioPeso: false,
            height: window.innerHeight
        })
    }

    render() {
        let altura = this.state.height;
        let scroll = this.props.posicion;
        let posicion = 0;
        let position = 'relative';
        if (!isMobile) {
            position = 'relative';
            posicion = 100;
            posicion += scroll * 3;
            if (altura < (posicion + 500)) {
                posicion = altura - 500;
            }
        } else {
            position = 'static';
        }
        let hoy = new Date();
        let mes = hoy.getMonth() + 1;
        mes = mes < 10 ? "0" + mes : mes;
        let fecha = hoy.getFullYear() + "-" + mes + "-" + hoy.getDate();
        return (
            <div className='container mt-5 mb-4' style={{position: position, bottom: posicion, marginBottom: 0}}>
                <h2>Añadir dato</h2>
                <div className='tabla'>
                    <div className="form-group row mb-2 mt-4 mx-3">
                        <label htmlFor="dia"
                               className="col-sm-2 col-form-label col-form-label-sm">Día</label>
                        <div className="col-sm-4 mb-2 mb-md-0">
                            <input ref={dia => {
                                this.inputDia = dia
                            }}
                                   value={fecha}
                                   onChange={this.handleOnChangeDia} type="date"
                                   className={this.state.vacioDia ? "form-control form-control-sm vacio" : " form-control form-control-sm"}
                                   id="dia"
                                   placeholder="dd/mm/yyyy"/>
                        </div>
                        <label htmlFor="peso"
                               className="col-sm-2 col-form-label col-form-label-sm">Peso</label>
                        <div className="col-sm-4">
                            <input ref={peso => {
                                this.inputPeso = peso
                            }} onChange={() => this.handleOnChangePeso(this.inputPeso)}
                                   type="number"
                                   className={this.state.vacioPeso ? "form-control form-control-sm vacio inputNumber" : " form-control form-control-sm inputNumber"}
                                   step='0.01'
                                   pattern="[0-9]+([\.,][0-9]+)?"
                                   min='0'
                                   max='400'
                                   id="peso"
                                   placeholder="kg"/>
                        </div>
                    </div>
                    <div className="form-group row py-2 mx-3">
                        <label htmlFor="observaciones"
                               className="col-sm-2 col-form-label col-form-label-sm">Info</label>
                        <div className="input-group col-sm-10">
                            <input ref={obs => {
                                this.inputObs = obs
                            }}
                                   onChange={() => this.handleOnChangeObservaciones(this.inputObs)}
                                   type="text"
                                   className="form-control form-control-sm"
                                   id="obervaciones"
                                   list="obs"
                                   placeholder="Observaciones"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary dropdown-toggle btn-sm btn-dropdown"
                                        type="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">Después de...
                                </button>
                                <div className="dropdown-menu">
                                    <p className="dropdown-item"
                                       onClick={() => this.handleObservaciones("Después de entrenar")}>Entrenar</p>
                                    <p className="dropdown-item"
                                       onClick={() => this.handleObservaciones("Después de comer")}>Comer</p>
                                    <p className="dropdown-item"
                                       onClick={() => this.handleObservaciones("Después de despertarse")}>Despertarse</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row py-2 mx-3">
                        <Button className='btn ml-auto mr-3 mt-3' color='primary' variant='contained'
                                onClick={this.handleEnviar}>Insertar</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Datos;