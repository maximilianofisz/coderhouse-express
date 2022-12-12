# Coderhouse: Desafio con Express
## Iniciar el proyecto
Para iniciar el proyecto se puede ejecutar alguno o ambos de los siguientes comandos:
```
npm run cluster
npm run fork
```
## Configurar 

* Para modificar la cantidad de instancias, puertos u otras configs, se puede modificar los archivos *Start.config.js.

* La configuracion de nginx se puede modificar desde default.conf seguido de hacer un rebuild del dockerfile.

## Motor de plantilla seleccionado
Probablemente utilize el motor de plantillas Handlebars porque es el mas minimalista: El html del template es casi html nativo con excepcion de la logica y la posibilidad de acceso a los datos inyectados. En segundo lugar, pondria a EJS, que a pesar de que no me gusto su sintaxis, me intereso la posibilidad de inyectar javascript scripts nativamente.


## Definiciones
| Version de artefacto | Puerto |
| ----------- | ----------- |
| Handlebars | Configurable al iniciar contenedor |

