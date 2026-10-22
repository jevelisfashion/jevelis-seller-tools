
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
  res.setHeader("X-Content-Type-Options", "nosniff");

  let pathname;

  try {
    pathname = new URL(req.url, "http://localhost").pathname;
    if (pathname !== "/") pathname = pathname.replace(/\/+$/, "");
  } catch {
    res.writeHead(400, {
      "Content-Type": "application/json; charset=utf-8"
    });
    res.end(JSON.stringify({
      success: false,
      message: "Alamat permintaan tidak valid."
    }));
    return;
  }

  // Dashboard utama
  if (req.method === "GET" && pathname === "/") {
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

  // Status server
  if (req.method === "GET" && pathname === "/api/status") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });
    res.end(JSON.stringify({
      success: true,
      app: "Jevelis Seller Tools",
      server: "Aktif",
      shopee: "Belum terhubung",
      message: "Callback tersedia; otorisasi dan pertukaran token belum dikonfigurasi."
    }));
    return;
  }

  // Callback awal Shopee
  if (req.method === "GET" && pathname === "/shopee/callback") {
    const params = new URL(req.url, "http://localhost").searchParams;
    const code = params.get("code");
    const shopId = params.get("shop_id");
    const mainAccountId = params.get("main_account_id");
    const error = params.get("error");

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    if (error) {
      res.end(
        "<!doctype html><html lang=\"id\"><meta charset=\"utf-8\">" +
        "<title>Otorisasi Shopee</title><body><h2>Otorisasi belum berhasil</h2>" +
        "<p>Shopee mengembalikan respons error. Silakan kembali ke aplikasi.</p>" +
        "</body></html>"
      );
      return;
    }

    if (!code || (!shopId && !mainAccountId)) {
      res.end(
        "<!doctype html><html lang=\"id\"><meta charset=\"utf-8\">" +
        "<title>Callback Shopee</title><body><h2>Callback Shopee aktif</h2>" +
        "<p>Endpoint sudah tersedia, tetapi belum menerima kode otorisasi lengkap. " +
        "Jangan bagikan URL callback yang berisi parameter ke siapa pun.</p>" +
        "</body></html>"
      );
      return;
    }

    // Jangan tampilkan atau simpan kode otorisasi di halaman.
    // Pertukaran code menjadi token ditambahkan pada tahap berikutnya.
    res.end(
      "<!doctype html><html lang=\"id\"><meta charset=\"utf-8\">" +
      "<title>Otorisasi Shopee</title><body><h2>Respons otorisasi diterima</h2>" +
      "<p>Callback berhasil menerima parameter. Pertukaran token belum diaktifkan.</p>" +
      "<p>Kembali ke Jevelis Seller Tools untuk langkah berikutnya.</p>" +
      "</body></html>"
    );
    return;
  }

  // Endpoint produk Shopee belum terhubung
  if (req.method === "GET" && pathname === "/api/shopee/products") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });
    res.end(JSON.stringify({
      success: false,
      connected: false,
      products: [],
      message: "Otorisasi dan autentikasi API Shopee belum dikonfigurasi."
    }));
    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify({
    success: false,
    message: "Endpoint tidak ditemukan.",
    path: pathname
  }));
});

server.listen(PORT, HOST, () => {
  console.log("==================================");
  console.log(" JEVELIS SELLER TOOLS");
  console.log(" Server aktif!");
  console.log(` Port: ${PORT}`);
  console.log(" Callback: /shopee/callback");
  console.log("==================================");
});
