import Knex from "knex"
import config from "./sqliteConfig.js"
const knex = Knex(config)



knex.schema
    .createTable("mensajes", (table) => {
        table.increments("id")
        table.string("correo")
        table.string("fecha")
        table.string("mensaje")
    })
    .then( () => console.log("Table created"))
    .catch( (e) => {
        console.log(e)
    })
    .finally( () => {
        knex.destroy()
    })