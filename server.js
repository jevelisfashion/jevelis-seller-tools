
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;

const dashboardPath = path.join(
  __dirname,
  "jevelis-seller-tools-dashboard-improved.html"
);

const server = http.createServer((req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET" && req.url === "/") {
    if (!fs.existsSync(dashboardPath)) {
      res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end("File dashboard tidak ditemukan.");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });
    fs.createReadStream(dashboardPath).pipe(res);
    return;
  }

  if (req.method === "GET" && req.url === "/api/status") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      success: true,
      app: "Jevelis Seller Tools",
      server: "Aktif",
      shopee: "Belum terhubung",
      message: "Server aktif. Koneksi API Shopee belum dikonfigurasi."
    }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/shopee/products") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      success: false,
      connected: false,
      products: [],
      message: "Autentikasi API Shopee belum dikonfigurasi."
    }));
    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify({
    success: false,
    message: "Endpoint tidak ditemukan."
  }));
});

server.listen(PORT, HOST, () => {
  console.log("==================================");
  console.log(" JEVELIS SELLER TOOLS");
  console.log(" Server aktif!");
  console.log(` Port: ${PORT}`);
  console.log(` Status: http://localhost:${PORT}/api/status`);
  console.log("==================================");
});
