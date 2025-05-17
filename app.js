const express = require('express');
const app = express();
const port = 80;
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const os = require('node:os');

// Compteur pour suivre le nombre d'utilisateurs connectés
let nofu = 0;

// Setup Express et le serveur HTTP
const server = http.createServer(app);
//const hostname='192.168.11.109';
// Serveur WebSocket
const wss = new WebSocket.Server({ server });

// Stocker tous les clients connectés
wss.on('connection', (ws) => {
  console.log('Client connecté');
  nofu++;
  console.log("Nombre d'utilisateurs connectés : " + nofu);

  // Lorsque un message est reçu d'un client
  ws.on('message', (message) => {
    console.log('Message reçu:', message);

    // Diffuser le message à tous les clients connectés
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        
        client.send(message.toString()); // envoyer en texte ou base64
      }
    });
  });

  // Lorsqu'un client se déconnecte
  ws.on('close', () => {
    nofu--;
    console.log("Nombre d'utilisateurs connectés : " + nofu);
    console.log('Client déconnecté');
  });
});

// Rendre le fichier index.html disponible
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
server.listen(port,() => {
  console.log(`Serveur en cours d'exécution  `);
});
