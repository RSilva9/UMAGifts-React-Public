import React from 'react'
import axios from 'axios';
import { Loader } from "./Loader.js"
import siteContext from './siteContext.js';

class ProductAccordion extends React.Component {
    static contextType = siteContext
    constructor(props) {
        super(props);
        this.state = {
            estuches: [],
            botellas: [],
            delis: [],
            isLoading: true
        };
    }
    async componentDidMount() {
        const products = this.context.products
        const estuches = []
        const botellas = []
        const delis = []

        for(let prod of products){
            if(prod.tipo === "estuche"){ 
                estuches.push(prod)
            }else if(prod.tipo === "bebida"){ 
                botellas.push(prod)
            }else{
                delis.push(prod)
            }
        }

        this.setState({
            estuches: estuches,
            botellas: botellas,
            delis: delis,
            isLoading: false
        });
    }
    render() {
        return (
            <section id="customBoxContainer">
                {this.state.isLoading ? <Loader/> : null}
                <div id="customBoxContainer-item1">
                    <div className="brand">
                        <h2>Estuches</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.estuches.map(est=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={est.codigo}>
                                    <input type="radio" className="stretched-link" name="estuche"/>
                                    <img src={est.img} alt="..." />
                                    <h2>{est.nombre}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id="customBoxContainer-item2">
                    <div className="brand">
                        <h2>Vinos y espumantes</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.botellas.map(bot=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={bot.codigo}>
                                    <input type="checkbox" className="stretched-link" name="botella"/>
                                    <img src={bot.img} alt="..." />
                                    <h2>{bot.nombre}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id="customBoxContainer-item3">
                    <div className="brand">
                        <h2>Delicatessen</h2>
                    </div>
                    <div className="accGrid">
                        {this.state.delis.map(del=>{
                            return(
                                <div className="cCard h-100 pb-3 px-2" key={del.codigo}>
                                    <input type="checkbox" className="stretched-link" name="deli"/>
                                    <img src={del.img} alt="..." />
                                    <h2>{del.nombre}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default ProductAccordion