import React, { useEffect } from "react";
import { createContext, useState } from "react";
import axios from "axios";
import { Loader } from "./Loader.js";

const siteContext = createContext({
    contextUser: [],
    boxes: [],
    products: []
})

function ContextProvider(props){
    const [contextUser, setUser] = useState([])
    const [boxes, setBoxes] = useState([])
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
          try {
            const resp1 = await axios.get(`${process.env.REACT_APP_APIURL}api/users/getUser`, { withCredentials: true })
            setUser(resp1.data)
          } catch (error) {
            console.error("Error fetching data:", error)
          }
          const resp2 = await axios.get(`${process.env.REACT_APP_APIURL}api/boxes`, { withCredentials: true })
          const resp3 = await axios.get(`${process.env.REACT_APP_APIURL}api/products`, { withCredentials: true })
          setBoxes(resp2.data)
          setProducts(resp3.data)
          setIsLoading(false)
        }
    
        fetchAll()
    }, [])

    return (
        <siteContext.Provider value={{ contextUser, boxes, products }}>
          {!isLoading ? props.children : <Loader />}
        </siteContext.Provider>
    )
}

export { ContextProvider }

export default siteContext;