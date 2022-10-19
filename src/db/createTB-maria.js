const Knex = require("knex") 


knex = Knex({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "coderhouse"
    }
})

knex.schema
    .createTable("productos", (table) => {
        table.increments("id")
        table.string("nombre")
        table.string("descripcion")
        table.integer("precio")
        table.integer("codigo")
        table.integer("stock")
        table.string("thumbnail")

    })
    .then( () => console.log("Table created"))
    .catch( (e) => {
        console.log(e)
    })
    .finally( () => {
        knex.destroy()
    })