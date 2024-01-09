export const Loader = ({mode})=>{
    if(mode == "transp"){
        return(
            <div className="preLoaderTransparent">
                <img src='/img/PreloaderUMA.gif' width={500}></img>
            </div>
        )
    }else if(mode == "addToCart"){
        return(
            <div className="preLoaderCard">
                <img src='/img/PreloaderUMA.gif' width={500}></img>
                <h4 className="text-center">Añadiendo al carrito.</h4>
            </div>
        )
    }else{
        return(
            <div className="preLoader">
                <img src='/img/PreloaderUMA.gif' width={500}></img>
            </div>
        )
    }
}