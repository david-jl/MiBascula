import React, {Component} from 'react';
import {Line} from 'react-chartjs-2'
import firebase from 'firebase'
import {isMobile} from 'react-device-detect';
import flecha from '../flecha.png';
import '../css/Grafico.css'
import {firebaseAuth} from "../index";


export const graficoDatos = (arrayDia, arrayPeso) => {
    let dia = arrayDia.map((dato) => dato);
    let peso = arrayPeso.map((dato) => dato);
    return crearGrafico(dia, peso);
};

const crearGrafico = (dia, peso) => {
    return {
        labels: dia,
        datasets: [
            {
                data: peso,
                borderWidth: 2,
                lineTension: 0,
                fill: false,
                borderColor: '#000',
                legend: false,
            }
        ]
    };
};

class Grafico extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dia: [],
            peso: [],
            obs: [],
            cambiar: "null",
            mes: new Date().getMonth(),
            anio: new Date().getFullYear()
        };
        this.grafico = React.createRef();
    }

    mes_izquierda() {
        let mes = this.state.mes;
        let anio = this.state.anio;
        setTimeout(() => {
            if (mes === 0) {
                anio--;
                mes = 11;
            } else
                mes--;
            this.setState({
                cambiar: "izq",
                mes: mes,
                anio: anio,
            })
        }, 500);
        setTimeout(() => {
            this.setState({
                cambiar: "null",
                mes: mes,
                anio: anio,
            })
        }, 1000);
        this.setState({
            cambiar: "izq",
            mes: mes,
            anio: anio,
        });
        setTimeout(() => {
            this.nuevaRuta()
        }, 500);
    }

    mes_derecha() {
        let mes = this.state.mes;
        let anio = this.state.anio;
        setTimeout(() => {
            if (mes === 11) {
                anio++;
                mes = 0;
            } else
                mes++;
            this.setState({
                cambiar: "der",
                mes: mes,
                anio: anio,
            })
        }, 500);
        setTimeout(() => {
            this.setState({
                cambiar: "null",
                mes: mes,
                anio: anio,
            })
        }, 1000);
        this.setState({
            cambiar: "der",
            mes: mes,
            anio: anio,
        });
        setTimeout(() => {
            this.nuevaRuta()
        }, 500);
    }

    nuevaRuta() {
        let labelDia = [];
        let labelPeso = [];
        let labelObs = [];

        let ruta_fecha = this.state.anio + "/";
        if (this.state.mes < 9) ruta_fecha += "0" + (this.state.mes + 1);
        else ruta_fecha += (this.state.mes + 1);
        firebase.database().ref().child('datos').child(firebaseAuth().getUid() + "/" + ruta_fecha).orderByChild('dia').on('value', snapshot => {
            labelDia = ["", "", "", "", "", "", "", "", "", "", "", ""];
            labelPeso = [];
            labelObs = [];
            let i = 0;
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    let dia = child.val().dia.substring(8, 10) + "/" + child.val().dia.substring(5, 7) + "/" + child.val().dia.substring(0, 4);
                    if (child.numChildren > 12)
                        labelDia.push(dia);
                    else {
                        labelDia[i] = dia;
                        i++;
                    }
                    labelPeso.push(child.val().peso);
                    labelObs.push(child.val().observacion);
                });
                this.setState({
                    dia: labelDia,
                    peso: labelPeso,
                    obs: labelObs
                });
            } else {
                this.setState({
                    dia: labelDia,
                    peso: labelPeso,
                    obs: labelObs
                });
            }
        });
    }

    componentDidMount() {
        this.nuevaRuta();
    }

    render() {
        let pesos = this.state.peso;
        let observaciones = this.state.obs;
        let minimo = Math.min.apply(0, pesos);
        let maximo = Math.max.apply(100, pesos);
        if (maximo < 0) {
            minimo = 10;
            maximo = 90;
        }
        let estilos = '';
        if (isMobile)
            estilos = 'container grafica-movil';
        else
            estilos = 'container grafica-ordenador';
        const alto = window.innerHeight * 0.9;
        return (
            <div style={{height: alto}} className={estilos} onScroll={this.handleScroll}>
                <div className='d-flex justify-content-center'>
                    <Mes anio={this.state.anio} cambiar={this.state.cambiar} mes={this.state.mes}
                         onMesIzquierda={() => this.mes_izquierda()} onMesDerecha={() => this.mes_derecha()}/>
                </div>
                <div className='mt-2 mt-md-4'>
                    <Line
                        width={800}
                        height={400}
                        data={graficoDatos(this.state.dia, this.state.peso)}
                        options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        suggestedMin: minimo - 2,
                                        suggestedMax: maximo + 2
                                    }
                                }],
                                XAxes: [{
                                    ticks: {
                                        suggestedMin: 7
                                    }
                                }]
                            },
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                            },
                            tooltips: {
                                titleMarginBottom: 8,
                                titleFontStyle: 'normal',
                                footerFontColor: '#383838',
                                footerFontStyle: 'normal',
                                intersect: false,
                                titleSpacing: 3,
                                xPadding: 10,
                                yPadding: 8,
                                callbacks: {
                                    title: function (tooltipItem, data) {
                                        let res = [];
                                        res.push(data['labels'][tooltipItem[0]['index']]);
                                        res.push(tooltipItem[0].yLabel + " kg");
                                        return res;
                                    },
                                    label: function (tooltipItem) {
                                        let res = pesos[tooltipItem['index']] - pesos[tooltipItem['index'] - 1];
                                        if (res === 0 || isNaN(res))
                                            return;
                                        res = Math.round(res * 100) / 100;
                                        res = (res < 0) ? "- " + Math.abs(res) : "+ " + Math.abs(res);
                                        return res + " kg";
                                    },
                                    footer: function (tooltipItem) {
                                        return observaciones[tooltipItem[0]['index']];
                                    },
                                    labelTextColor: function (tooltipItem) {
                                        let res = pesos[tooltipItem['index']] - pesos[tooltipItem['index'] - 1];
                                        return res < 0 ? '#d63c38' : '#4F9D32';
                                    }
                                },
                                backgroundColor: '#d6d6d6',
                                titleFontSize: 14,
                                titleFontColor: '#000',
                                bodyFontSize: 13,
                                displayColors: false
                            }
                        }}
                    />
                </div>
                <Flecha posicion={this.props.posicion}/>
            </div>
        )
    }
}

class Mes extends Component {

    mes_izquierda() {
        this.props.onMesIzquierda();
    }

    mes_derecha() {
        this.props.onMesDerecha();
    }

    render() {
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let fecha = meses[this.props.mes] + " " + this.props.anio;
        let cambiar = "mes-texto ";
        if (this.props.cambiar === "izq")
            cambiar += "mes-izq";
        else if (this.props.cambiar === "der")
            cambiar += "mes-der";
        setTimeout(() => {
            cambiar = "mes-texto ";
        }, 1000);
        return (
            <div className="mes mt-4 mt-md-4">
                <p onClick={() => this.mes_izquierda()} className='mes-flechas'>&lt;</p>
                <p className={cambiar}>{fecha}</p>
                <p onClick={() => this.mes_derecha()} className='mes-flechas'>&gt;</p>
            </div>
        )
    }
}

class Flecha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight
        };
    }

    handleWindowSizeChange = () => {
        this.setState({
            height: window.innerHeight
        });
    };

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    render() {
        let altura = this.state.height;
        let scroll = this.props.posicion;
        let alpha_flecha = 1;
        let alpha_texto = 1;

        if (!isMobile) {
            if (altura < 690)
                alpha_texto = 0;
            if (altura < 670)
                alpha_flecha = 0;
        } else {
            if (altura < 600)
                alpha_texto = 0;
            if (altura < 550)
                alpha_flecha = 0;
        }
        alpha_texto -= scroll / 20;
        alpha_flecha -= scroll / 20;
        return (
            <div className='div-flecha'>
                <p className='texto-flecha ' style={{opacity: alpha_texto}}>Añadir pesos</p>
                <img src={flecha} style={{opacity: alpha_flecha}} alt="Flecha" className='flecha'/>
            </div>
        )
    }
}

export default Grafico;