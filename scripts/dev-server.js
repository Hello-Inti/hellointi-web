#!/usr/bin/env node
const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const publicDir = path.resolve('public');

if (!isProduction) {
  const liveReloadServer = livereload.createServer({
    exts: ['html', 'css', 'js'],
    delay: 100,
  });

  liveReloadServer.watch(publicDir);

  liveReloadServer.server.once('connection', () => {
    setTimeout(() => liveReloadServer.refresh('/'), 100);
  });

  app.use(connectLivereload());
}

app.use(express.static(publicDir));

app.get('/', (_req, res) => {
  res.redirect('/website');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
