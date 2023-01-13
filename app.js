const express = require("express"); //import express
const expressLayouts = require("express-ejs-layouts"); //import ejs layout
const {
  loadProfiles,
  findProfile,
  addProfile,
  cekDuplikat,
  deleteProfile,
  updateProfile,
} = require("./utils/profils");
const { body, validationResult, check } = require("express-validator");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express(); // membuat server express
const port = 3000;
// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.set("view engine", "ejs"); //Menggunakan ejs;
app.use(expressLayouts); //middleware layout
app.use(express.static("public")); //built-in middleware untuk file public
app.use(express.urlencoded({ extended: true })); // pharsing data dari post

app.get("/", (req, res) => {
  res.render("index", { layout: "layouts/Beranda" });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/profiles", (req, res) => {
  const profiles = loadProfiles();
  res.render("profiles", {
    layout: "layouts/main-layout",
    title: "Halaman Profils",
    profiles,
    msg: req.flash("msg"),
  });
});

app.post(
  "/profiles",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama Yang Anda Masukkan Sudah Terdaftar");
      }
      return true;
    }),
    check("noHp", "Yang Anda masukkan bukan No. HP Valid").isMobilePhone(
      "id-ID"
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add", {
        layout: "layouts/main-layout",
        title: "Tambah data",
        errors: errors.array(),
      });
    } else {
      addProfile(req.body);
      // kirim flash massage
      req.flash("msg", "Data Berhasil Ditambahkan");
      res.redirect("/profiles");
    }
  }
);

app.get("/profiles/delete/:nama", (req, res) => {
  const profile = findProfile(req.params.nama);
  if (!profile) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteProfile(req.params.nama);
    // kirim flash massage
    req.flash("msg", "Data Berhasil Dihapus");
    res.redirect("/profiles");
  }
});

app.get("/profiles/edit/:nama", (req, res) => {
  const profile = findProfile(req.params.nama);
  res.render("edit-profile", {
    layout: "layouts/main-layout",
    title: "Form ubah data",
    profile,
  });
});

app.post(
  "/profiles/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama Yang Anda Masukkan Sudah Terdaftar");
      }
      return true;
    }),
    check("noHp", "Yang Anda masukkan bukan No. HP Valid").isMobilePhone(
      "id-ID"
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-profile", {
        layout: "layouts/main-layout",
        title: "Tambah data",
        errors: errors.array(),
        profile: req.body,
      });
    } else {
      updateProfile(req.body);
      // kirim flash massage
      req.flash("msg", "Data Berhasil Diubah");
      res.redirect("/profiles");
    }
  }
);

app.get("/profils/:nama", (req, res) => {
  const profile = findProfile(req.params.nama);
  res.render("Detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail",
    profile,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
