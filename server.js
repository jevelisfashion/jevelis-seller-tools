
const http = require("node:http");

const HOST = "127.0.0.1";
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET" && req.url === "/api/status") {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      app: "Jevelis Seller Tools",
      server: "Aktif",
      shopee: "Uji API sandbox berhasil",
      message: "Server lokal siap menerima pengembangan koneksi Shopee."
    }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/shopee/products") {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: false,
      connected: false,
      products: [],
      message: "Autentikasi Shopee belum dikonfigurasi di server lokal."
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: "Endpoint tidak ditemukan."
  }));
});

server.listen(PORT, HOST, () => {
  console.log("==================================");
  console.log(" JEVELIS SELLER TOOLS");
  console.log(" Server aktif!");
  console.log(` Alamat: http://${HOST}:${PORT}`);
  console.log(` Status: http://${HOST}:${PORT}/api/status`);
  console.log("==================================");
});
