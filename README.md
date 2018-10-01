# Zombie Survival Social Network

> O objetivo do projeto é prover uma API REST para  armazenar informações sobre os sobreviventes de um apocalipse zumbi, bem como os recursos que eles possuem.

## API
### API de Criação de sobreviventes
> O Objetivo desta API é possibilitar a criação de sobreviventes.

#### Uso da API de Criação de sobreviventes
```sh
POST /survivors HTTP/1.1
Host: http://localhost:3000/
Content-Type: application/json
```

```json
{ "name": "string",
  "age": "number",
  "gender": "string",
  "location":{
  	"latitude": "number",
  	"longitude": "number"
  }
}
```
#### Retorno da API de criação de sobreviventes

- 200   Ok
- 400   Bad Request
- 500   Internal server error

### API de relatar sobrevivente infectado
> O Objetivo desta API é possibilitar que um sobrevivente avise que o outro está infectado.
O sobrevivente passar a se tornar infectado após a 3 delações.

#### Uso da API de relatar sobrevivente infectado
```sh
POST /infected HTTP/1.1
Host: http://localhost:3000
Content-Type: application/json
```

```json
{ 
	"survivorName": "string",
	"relateInfected": "string"
}
```
#### Retorno da API de relatar sobrevivente infectado

- 200   Ok
- 400   Bad Request
- 409   Conflict
- 500   Internal server error

### API de troca de itens
> O Objetivo desta API é possibilitar que sobreviventes possam realizar a troca de seus itens.

#### Uso da API de troca de itens
```sh
POST /changeItems HTTP/1.1
Host: http://localhost:3000
Content-Type: application/json
```

```json
{
  "firstSurvivor": {
    "name": "string",
    "itemsChange":[
      {
        "nameItem": "string",
        "quantity": "number"
      }
    ] 
  },
  "secondSurvivor": {
    "name": "string",
    "itemsChange":[
      {
        "nameItem": "string",
        "quantity": "number"
      }
    ] 
  }
}
```
#### Retorno da API de troca de itens

- 200   Ok
- 400   Bad Request
- 500   Internal server error

### API de atualização de localização de sobrevivente
> O Objetivo desta API é possibilitar que sobreviventes possam ter sua localização atualizada.

#### Uso da API de atualização de localização de sobrevivente
```sh
POST /locations/{name} HTTP/1.1
Host: http://localhost:3000
Content-Type: application/json
```

```json
{ 
	"latitude": "number",
	"longitude": "number"
}
```
#### Retorno da API de atualização de localização de sobrevivente

- 200   Ok
- 400   Bad Request
- 500   Internal server error



#### Retorno da API de troca de itens

- 200   Ok
- 400   Bad Request
- 500   Internal server error

### API de relatorios
> O Objetivo desta API é fornecer relatorios.

#### Uso da API de atualização de localização de sobrevivente
```sh
POST /reports HTTP/1.1
Host: http://localhost:3000
Content-Type: application/json
```

#### Retorno da API de atualização de localização de sobrevivente

- 200   Ok
- 404   Not Found
- 500   Internal server error



## Stack
- [node.js] - Plataforma de desenvolvimento
- [Express] - Web framwork minimalista desenvolvido em node.js
- [New Relic] - Plataforma de monitoramento 
- [Circleci] - Integração contínua
- [MongoDb] - Banco de dados NoSql


## Instalação e execução da aplicação

### Testes

Para executar a stack de testes basta executar o seguinte comando:

```sh
npm test
```

Para executar somente os testes automatizados deve ser executado:

```sh
npm run mocha
```

Para executar o projeto localmente basta executar o seguinte comando:

```sh
npm i
npm start
```