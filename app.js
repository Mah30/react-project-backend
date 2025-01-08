require('dotenv').config();
const jsonServer = require('json-server');
const morgan = require('morgan');

const server = jsonServer.create();

const router = jsonServer.router('db.json');

const express = require("express") 

const sharp = require('sharp');

const middlewares = jsonServer.defaults();
const PORT = 4000;

server.use(express.static ("publico"))
server.use(middlewares);
server.use(morgan('dev'));
server.use((req, res, next) => {
	// Middleware to disable CORS
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

server.get('/generate-image', async (req, res) => {
  try {
    const semiTransparentRedPng = await sharp({
      create: {
        width: 48,
        height: 48,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 },
      },
    })
      .jpg()
      .toBuffer();

    // Envia a imagem como resposta
    res.type('image/png').send(semiTransparentRedPng);
  } catch (err) {
    console.error('Erro ao gerar a imagem:', err);
    res.status(500).send('Erro ao gerar a imagem');
  }
});

server.use(router);

server.listen(PORT, () => {
	console.log(`JSON Server is running on http://localhost:${PORT}`);
});
