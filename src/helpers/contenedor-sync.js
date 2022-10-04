const fs = require('fs')


class Contenedor{
    constructor(path){
        this.path = path
    }

    save(objeto){
        objeto.timestamp = Date.now()
        //Caso de que no exista archivo o este vacio, creamos un array con el nuevo objeto y lo escribimos
        if(!fs.existsSync(this.path) || fs.readFileSync(this.path) == ""){
            objeto.id = 1
            
            let newData = [objeto]
            fs.writeFileSync(this.path, JSON.stringify(newData, null, 2))
            /* console.log(JSON.parse(fs.readFileSync(this.path))) */
            /* console.log(`Id asignado al nuevo objeto es ${objeto.id}`) */
        }
        //Si el archivo ya existe
        else{
            let currentData = JSON.parse(fs.readFileSync(this.path)) //Nos traemos el contenido existente y lo parseamos

            //El array que insertaremos en el archivo, lo populamos con lo viejo + el objeto input
            let newData = [] 
            for(let i = 0; i < currentData.length; i++){
                newData.push(currentData[i])
            }
            if(currentData.length == 0){
                objeto.id = 1
            }
            else{
                objeto.id = currentData[currentData.length-1]["id"] + 1
            }
            
            newData.push(objeto)
            
            
            //borramos el archivo viejo y lo reemplazamos con el nuevo
            fs.unlinkSync(this.path)
            fs.writeFileSync(this.path, JSON.stringify(newData, null, 2))

            /* console.log(JSON.parse(fs.readFileSync(this.path))) */
            /* console.log(`Id asignado al nuevo objeto es ${objeto.id}`) */
        }
    }

    saveWithId(objeto, id){
        //Caso de que no exista archivo o este vacio, creamos un array con el nuevo objeto y lo escribimos
        if(!fs.existsSync(this.path) || fs.readFileSync(this.path) == ""){
            objeto.id = 1
            let newData = [objeto]
            fs.writeFileSync(this.path, JSON.stringify(newData, null, 2))
            console.log(JSON.parse(fs.readFileSync(this.path)))
            console.log(`Id asignado al nuevo objeto es ${objeto.id}`)
        }
        //Si el archivo ya existe
        else{
            let currentData = JSON.parse(fs.readFileSync(this.path)) //Nos traemos el contenido existente y lo parseamos

            //El array que insertaremos en el archivo, lo populamos con lo viejo + el objeto input
            let newData = [] 
            for(let i = 0; i < currentData.length; i++){
                newData.push(currentData[i])
            }
            objeto.id = id
            newData.push(objeto)
            
            
            //borramos el archivo viejo y lo reemplazamos con el nuevo
            fs.unlinkSync(this.path)
            fs.writeFileSync(this.path, JSON.stringify(newData, null, 2))

            console.log(JSON.parse(fs.readFileSync(this.path)))
            console.log(`Id asignado al nuevo objeto es ${objeto.id}`)
        }
    }

    getbyId(numero){
        let currentData = JSON.parse(fs.readFileSync(this.path))
        let result = currentData.findIndex(x => x.id === numero) //Busco que indice tiene el objeto con el numero que quiero
        if(result == -1){
            console.log(null)
            return null
        }
        else{
            console.log(currentData[result])
            return currentData[result]
        }        
    }

    getAll(){
        if(!fs.existsSync(this.path) || fs.readFileSync(this.path) == ""){
            return []
        }
        else{
            let all = JSON.parse(fs.readFileSync(this.path))
            /* console.log(all) */
            return all
        }

    }

    deleteById(numero){
        let currentData = JSON.parse(fs.readFileSync(this.path))
        let toDelete = currentData.findIndex(x => x.id === numero) //Busco que indice tiene el objeto con el numero que quiero eliminar
        if(toDelete == -1){
            console.log(null)
            return null
        }
        else{
            currentData.splice(toDelete, 1)
            fs.unlinkSync(this.path)
            fs.writeFileSync(this.path, JSON.stringify(currentData, null, 2))
            console.log(currentData)
        }        

    }

    deleteAll(){
        fs.writeFileSync(this.path, "")
    }


}

module.exports = Contenedor


