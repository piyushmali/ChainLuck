const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 8545;
const MONAD_RPC = 'https://rpc.testnet.monad.xyz';

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      // Forward request to Monad RPC
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(MONAD_RPC, options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy request failed:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Proxy request failed' }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});

server.listen(PORT, () => {
  console.log(`🔗 RPC Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding to: ${MONAD_RPC}`);
  console.log(`🌐 CORS enabled for browser requests`);
});

server.on('error', (err) => {
  console.error('Proxy server error:', err);
}); 