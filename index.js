// Realizar la conexión con PostgreSQL, utilizando la clase Pool y definiendo un
// máximo de 20 clientes, 5 segundos como tiempo máximo de inactividad de un
// cliente y 2 segundos de espera de un nuevo cliente. (2 Puntos)

const { Pool } = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'alwaysmusic',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

const ejecutar = process.argv.slice(2);

// Hacer todas las consultas con un JSON como argumento definiendo la propiedad name para el Prepared Statement. (2 Puntos)
// Hacer las consultas con texto parametrizado. (1 Punto)
// Liberar a un cliente al concluir su consulta. (1 Punto)

if (ejecutar[0] == 'nuevo'){
    pool.connect(async (error_conexion, client, release) => {
        // Retornar por consola un mensaje de error en caso de haber problemas de conexión.(1 Punto)
        if (error_conexion) return console.error(error_conexion.code);
        const nombre =  ejecutar[1]
        const rut =  ejecutar[2]
        const curso = ejecutar[3]
        const nivel = ejecutar[4]
        // Capturar los posibles errores en todas las consultas. (2 Puntos)
        try {
            const SQLQuery = {
                name: 'fetch-user',
                text:
                    "insert into estudiante (nombre, rut, curso, nivel) values ($1, $2, $3, $4) RETURNING *;",
                values: [nombre,rut,curso,nivel],
            };
            const res = await client.query(SQLQuery);
            console.log('Estudiante',res.rows[0].nombre,'agregado con exito');
        } catch (error_consulta){
            console.log(error_consulta.code);
        }    
        release();
        pool.end();
    });
};

if (ejecutar[0] == 'consulta'){
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion) return console.error(error_conexion.code);
        try {
            const SQLQuery = {
                name: 'fetch-user',
                // Obtener el registro de los estudiantes registrados en formato de arreglos. (1 Punto)
                rowMode: 'array',
                text: "select * from estudiante",
            };
            const res = await client.query(SQLQuery);
            console.log(res.rows);
        } catch (error_consulta){
            console.log(error_consulta.code);
        }
        release();        
        pool.end();
    });
};

if (ejecutar[0] == 'rut'){
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion) return console.error(error_conexion.code);
        const rut = ejecutar[1]
        try {
            const SQLQuery = {
                name: 'fetch-user',
                rowMode: 'array',
                text: "select * from estudiante where rut = $1",
                values: [`${rut}`]
            };
            const res = await client.query(SQLQuery);
            console.log(res.rows);
        } catch (error_consulta){
            console.log(error_consulta.code);
        } 
        release();        
        pool.end();
    });
};

if (ejecutar[0] == 'editar'){   
    pool.connect(async (error_conexion,client,release) =>{
        if (error_conexion) return console.error(error_conexion.code);
        const nombre =  ejecutar[1]
        const rut =  ejecutar[2]
        const curso = ejecutar[3]
        const nivel = ejecutar[4]
        try {
            const SQLQuery = {
                name: 'fetch-user',
                text: "UPDATE estudiante SET (curso,nivel) = ($1,$3) WHERE rut = $2 RETURNING *;",
                values: [`${curso}`,`${rut}`,`${nivel}`]
            };
            const res = await client.query(SQLQuery)
            console.log(`Estudiante ${nombre} modificado con exito`, res.rows[0]);
        } catch (error_consulta){
            console.log(error_consulta.code);
        }      
        release();        
        pool.end();
    });
};

if (ejecutar[0] == 'eliminar'){       
    pool.connect(async(error_conexion,client,release) => {
        if (error_conexion) return console.error(error_conexion.code);
        const rut = ejecutar[1]
        try {        
            const SQLQuery = {
                name: 'fetch-user',
                text: `DELETE FROM estudiante WHERE rut = $1`,
                values: [rut]
            };
            const res = await client.query(SQLQuery);
            console.log(`Registro de estudiante con rut ${rut} eliminado`);
            console.log('Cantidad de registros afectados',res.rowCount);
        } catch (error_consulta){
            console.log(error_consulta.code);
        }    
        release();       
        pool.end();
    });
};
