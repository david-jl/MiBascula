import React, {Component, Fragment} from 'react';
import '../css/Tabla.css'
import firebase from 'firebase'
import Tooltip from '@material-ui/core/Tooltip';
import {firebaseAuth} from "../index";
import Navbar from "./Navbar";

let timeoutHandle;

class Tabla extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datos: [],
            eliminados: [],
            items: 0,
            popup: 1,
            deshacer: false
        };
        this.handledelete = this.handledelete.bind(this);
    }

    handledelete(id, pos) {
        let ruta_fecha = this.state.datos[pos].dia.substring(5, 10) + this.state.datos[pos].dia.substring(2, 6);
        timeoutHandle = window.setTimeout(() => {
            firebase.database().ref().child('datos/' + firebaseAuth().getUid() + ruta_fecha + id).remove();
        }, 5000);
        let datos = this.state.datos;
        let items = this.state.items;
        --items;
        let eliminados = this.state.eliminados;
        eliminados.push([datos[pos], pos]);
        datos.splice(pos, 1);
        this.setState({
            datos: datos,
            items: items,
            popup: this.state.popup + 1,
            deshacer: false
        });
    }

    handleDeshacer() {
        let eliminados = this.state.eliminados;
        let datos = this.state.datos;
        if (eliminados.length > 0)
            datos.splice(eliminados[eliminados.length - 1][1], 0, eliminados[eliminados.length - 1][0]);
        let items = this.state.datos;
        ++items;
        window.clearTimeout(timeoutHandle);
        this.setState({
            datos: datos,
            eliminados: [],
            items: items,
            deshacer: true
        })
    }

    componentWillMount() {
        const {datos} = this.state;
        let items = this.state.items;
        let ref = firebase.database().ref().child('/datos/' + firebaseAuth().getUid());
        ref.on('child_added', snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(anioSnapShot => {
                    if (anioSnapShot.exists()) {
                        anioSnapShot.forEach(mesSnapShot => {
                            let dia = mesSnapShot.val().dia.substring(8, 10) + "/" + mesSnapShot.val().dia.substring(5, 7) + "/" + mesSnapShot.val().dia.substring(0, 4);
                            datos.push({
                                dia: dia,
                                peso: mesSnapShot.val().peso,
                                observacion: mesSnapShot.val().observacion,
                                id: mesSnapShot.val().id,
                            });
                            items++;
                            this.setState({
                                datos: datos,
                                items: items,
                                popup: this.state.popup,
                            });
                        });
                    }
                });
            }
        })
    }

    /*if (snapshot.exists()) {
        snapshot.forEach(anioSnapShot => {
            if(anioSnapShot.exists()) {
                anioSnapShot.forEach(mesSnapShot => {
                    if(mesSnapShot.exists()) {
                        mesSnapShot.forEach(child => {
                            let dia = child.val().dia.substring(8, 10) + "/" + child.val().dia.substring(5, 7) + "/" + child.val().dia.substring(0, 4);
                            datos.push({
                                dia: dia,
                                peso: child.val().peso,
                                observacion: child.val().observacion,
                                id: child.val().id,
                            });
                            items++;
                            this.setState({
                                datos: datos,
                                items: items,
                                popup: this.state.popup,
                            });
                        });
                    }
                });
            }
        })
    }*/


    render() {
        return (
            <Fragment>
                <Navbar/>
                <div className=' container'>
                    <table className='table table-striped tabla mt-5 '>
                        <thead>
                        <tr>
                            <th style={{width: "34%"}} scope="col">Día</th>
                            <th style={{width: "25%"}} scope="col">Peso</th>
                            <th style={{width: "34%"}} scope="col">Observaciones</th>
                            <th style={{width: "7%"}} scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        <Fila onHandleDelete={(id, pos) => this.handledelete(id, pos)} datos={this.state.datos}
                              items={this.state.items}/>
                        </tbody>
                    </table>
                </div>
                <PopUp deshacer={this.state.deshacer} onDeshacer={() => this.handleDeshacer()} show={this.state.popup}/>
            </Fragment>
        );
    }
}

class Fila extends Component {
    constructor(props) {
        super(props);
        this.handledelete = this.handledelete.bind(this);
    }

    handledelete(id, pos) {
        this.props.onHandleDelete(id, pos);
    }

    render() {
        if (this.props.items === 0) {
            return (
                <tr style={{height: "40px"}}>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                </tr>
            )
        } else {
            let data = this.props.datos;
            return (
                data.map((datos, pos) => {
                    let id = datos.id;
                    return (
                        <tr key={id}>
                            <td className='texto-tabla-fecha'>{datos.dia}</td>
                            <td className='texto-tabla'>{datos.peso} kg</td>
                            <td className='texto-tabla'>{datos.observacion}</td>
                            <Tooltip title='Borrar' placement='right'>
                                <td className='borrarTabla' onClick={() => this.handledelete(id, pos)}>x</td>
                            </Tooltip>
                        </tr>
                    )
                })
            )
        }
    }
}

class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {show: false};
        this.hanldeDeshacer = this.hanldeDeshacer.bind(this);
    }

    componentWillReceiveProps(nextProps, next) {
        if (nextProps.show === this.props.show + 1) {
            this.setState({show: true});
            setTimeout(() => {
                this.setState({show: false});
            }, 4000);
        }
    }

    hanldeDeshacer() {
        this.props.onDeshacer();
    }

    render() {
        return (
            <p className={this.state.show && !this.props.deshacer ? 'popup' : 'transparente'}>Eliminado
                <span className='deshacer' onClick={() => this.hanldeDeshacer()}>DESHACER</span></p>
        )
    }
}

export default Tabla;