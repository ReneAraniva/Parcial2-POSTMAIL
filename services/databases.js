const mongoose = require('mongoose')
require('dotenv').config()

class Database {
    constructor() {
        this.connect();
    }

    connect(){
        mongoose.connect(process.env.MONGODB_URI,{
        
        })
        .then((() => console.log('Conexion exitosa MongoDB')))
        .catch(err => console.error('Error de configuracion',err))
    }

    static obtenerConexion(){
        if(!Database.instancia){
            Database.instancia= new Database()
        }
        return Database.instancia;
    }
}

module.exports= Database.obtenerConexion();