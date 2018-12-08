import * as React from "react";
import Navbar from "./Navbar";
import '../css/Ayuda.css'

class Ayuda extends React.Component {
    render() {
        return (
            <div className='parent-ayuda d-flex flex-column justify-content-start align-items-center'>
                <Navbar/>
                <Tutorial titulo={"Insertar pesos"}
                          text1={" Pulsar en la flecha de arriba a la izquierda para volver a la pantalla de inicio."}
                          text2={" Bajar hasta ver el cuadro \"Añadir datos\"."}
                          text3={" Introducir fecha y peso (Observaciones es opcional)."}
                          text4={" Pulsar insertar para guardarlo en el gráfico."}
                />
                <Tutorial titulo={"Eliminar pesos"} text={"Elimina un peso de tu historial."}
                          text1={" Pulsar en los tres puntos de arriba a la derecha."}
                          text2={" Haz click en \"Mis pesos\"."}
                          text3={" Se mostrará una tabla con todos los pesos en orden de fecha."}
                          text4={" Pulsa en la cruz roja de la derecha de una fila para borrar esa fila."}
                />
            </div>
        );
    }
}


class Tutorial extends React.Component {
    constructor() {
        super();
        this.state = {
            expandir: "cuadro-ayuda d-flex flex-column justify-content-between align-items-between"
        };
    }

    handleExpandir = () => {
        let findExpandir = this.state.expandir.indexOf('expandir') !== -1;
        if (!findExpandir)
            this.setState({expandir: "cuadro-ayuda d-flex flex-column justify-content-between align-items-between expandir"});
        else
            this.setState({expandir: "cuadro-ayuda d-flex flex-column justify-content-between align-items-between cerrar"});
    };

    render() {
        let findExpandir = this.state.expandir.indexOf('expandir') !== -1;
        let texto_boton = "Más información";
        let texto_pasos = "m-0 cerrar-pasos";
        if (findExpandir) {
            texto_boton = "Cerrrar pestaña";
            texto_pasos += " expandir-pasos";
        }
        return (
            <div className={this.state.expandir}>
                <h5>{this.props.titulo}</h5>
                <ol>
                    <li className={texto_pasos}>{this.props.text1}</li>
                    <li className={texto_pasos}>{this.props.text2}</li>
                    <li className={texto_pasos}>{this.props.text3}</li>
                    <li className={texto_pasos}>{this.props.text4}</li>
                </ol>
                <button type="button"
                        className="btn btn-outline-secondary boton-cuadro-ayuda align-self-center"
                        onClick={() => {
                            this.handleExpandir()
                        }}>
                    {texto_boton}
                </button>
            </div>
        )
    }
}

export default Ayuda;