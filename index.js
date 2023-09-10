require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const parse = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(parse.json());
app.use(parse.urlencoded({extended: false}));

let urlref = [];

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let dnsurl = new URL(req.body.url,).hostname;
  dns.lookup(dnsurl, (err) => {
    if(err) {
      res.json({ error: 'invalid url' });
    } else {
      let short = Math.floor(Math.random() * 10) + 1;
      let url = {
        original_url : req.body.url, 
        short_url : short
      };
      urlref.push(url);
      res.json(url);
    }
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  let url = urlref.find(x => x.short_url == +req.params.id).original_url;
  res.redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
