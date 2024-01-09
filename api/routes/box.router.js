import { Router } from "express";
import { boxManager } from "../managers/BoxManager.js";

export const boxRouter = Router()

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
      return next();
    }
    return res.status(403).send("Acceso denegado. No tienes permisos de administrador.");
}

boxRouter.get('/filteredBox', async(req, res)=>{
    try {
        const tipo = req.query.tipo
        const tam = req.query.tam
        const deli = req.query.deli
        let query = {};
        if (tipo) {
            query.tipo = tipo;
        }
        if (tam) {
            query.tam = tam;
        }
        if (deli) {
            query.deli = deli;
        }
        const boxes = await boxManager.getFilteredBox(query)
        res.status(200).send(boxes)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

boxRouter.get('/', async(req, res)=>{
    try {
        const boxes = await boxManager.getBoxes()
        res.status(200).send(boxes)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

boxRouter.get('/:bid', async(req, res)=>{
    try {
        const boxCodigo = req.params.bid
        const box = await boxManager.getBoxById(boxCodigo)
        res.status(200).send(box)
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})