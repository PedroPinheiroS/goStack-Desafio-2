const express = require("express");
const cors = require("cors");

 const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validarBodyRepositories( request, response, next){

  const { title, url, techs } = request.body;

  if ( techs == null ){
    return response.status(400).json({ error : 'Techs não pode ser nulo'});
  }
  
  if ( title == null ) {
    return response.status(400).json({ error : 'Title não pode ser nulo'});
  }
  
  if ( url == null ) { 
    return response.status(400).json({ error : 'Url não pode ser nula'});
  }

  return next();
}


app.get("/repositories", (request, response) => {

  response.status(200).json(repositories);

});

app.post("/repositories", validarBodyRepositories, (request, response) => {

const { title, url, techs } = request.body;

const repository = { id: uuid(), title, url, techs, likes: 0 }

repositories.push(repository);

return response.status(201).json({ repository });

  
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(400).json({ erro: 'Repositório não encontrado'});
  }

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(404).json({ erro: 'Repositório não encontrado'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {

const { id } = request.params;

const repositoryIndex = repositories.findIndex(repo => repo.id === id);

if (repositoryIndex < 0 ) {
  return response.status(404).json({ erro: 'Repositório não encontrado'});
}

const repo = repositories[repositoryIndex];

repo.likes++;

repositories[repositoryIndex] = repo;

return response.status(201).json({ repo });


});

module.exports = app;
