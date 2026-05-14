const canvas = document.getElementById("oyunAlani");
const ctx = canvas.getContext("2d");
const arkaMuzik = document.getElementById("arkaMuzik");

const previewCanvas = document.getElementById("balikOnizleme");
const previewCtx = previewCanvas.getContext("2d");

const canYazisi = document.getElementById("can");
const skorYazisi = document.getElementById("skor");
const enYuksekSkorYazisi = document.getElementById("enYuksekSkor");
const mesafeYazisi = document.getElementById("mesafe");
const seviyeYazisi = document.getElementById("seviye");
const balikAdiYazisi = document.getElementById("balikAdi");
const durumYazisi = document.getElementById("durum");

const secimEkrani = document.getElementById("secimEkrani");
const secimBalikAdi = document.getElementById("secimBalikAdi");
const secimAciklama = document.getElementById("secimAciklama");
const secimHiz = document.getElementById("secimHiz");
const secimCan = document.getElementById("secimCan");
const secimBonus = document.getElementById("secimBonus");

const oncekiBalikButonu = document.getElementById("oncekiBalik");
const sonrakiBalikButonu = document.getElementById("sonrakiBalik");
const balikSecButonu = document.getElementById("balikSecButonu");
const oyunuBaslatButonu = document.getElementById("oyunuBaslatButonu");
const oyunuYenidenBaslatButonu = document.getElementById("oyunuYenidenBaslatButonu");
const muzikButonu = document.getElementById("muzikButonu");

let oyunuDondurButonu = document.getElementById("oyunuDondurButonu");
let karakterSecButonu = document.getElementById("karakterSecButonu");

if (!oyunuDondurButonu || !karakterSecButonu) {
    const butonlar = document.querySelector(".butonlar");

    oyunuDondurButonu = document.createElement("button");
    oyunuDondurButonu.id = "oyunuDondurButonu";
    oyunuDondurButonu.type = "button";
    oyunuDondurButonu.textContent = "Dondur";

    karakterSecButonu = document.createElement("button");
    karakterSecButonu.id = "karakterSecButonu";
    karakterSecButonu.type = "button";
    karakterSecButonu.textContent = "Balık Seç";

    if (butonlar) {
        butonlar.insertBefore(oyunuDondurButonu, oyunuYenidenBaslatButonu);
        butonlar.insertBefore(karakterSecButonu, muzikButonu);
    }
}

const balikSecenekleri = [
    {
        ad: "Şeker Kuyruk",
        aciklama: "Parlak pembe tonlu, dengeli ve sevimli bir başlangıç balığı.",
        ustRenk: "#ff9bb8",
        ortaRenk: "#ffd1df",
        altRenk: "#fff2f7",
        yuzgecRenk: "#ffb37b",
        kuyrukRenk: "#ff8aa7",
        vurguRenk: "#ffcf9b",
        cizgiRenk: "#ffc2d6",
        hiz: 5.1,
        can: 3,
        bonus: "Dengeli",
        boyut: 0.82,
        zehirBekleme: 25,
        zehirHasar: 1,
        gozRenk: "#ff9a3c"
    },
    {
        ad: "Limon Tang",
        aciklama: "Canlı sarı görünümüyle hızlıdır. Kaçış odaklı oyun için ideal.",
        ustRenk: "#d8d400",
        ortaRenk: "#ffe93a",
        altRenk: "#fff9af",
        yuzgecRenk: "#d6e750",
        kuyrukRenk: "#f2f06b",
        vurguRenk: "#fff7c8",
        cizgiRenk: "#d5da3d",
        hiz: 6.3,
        can: 2,
        bonus: "Hızlı",
        boyut: 0.78,
        zehirBekleme: 23,
        zehirHasar: 1,
        gozRenk: "#ff9a2e"
    },
    {
        ad: "Mercan Palyaço",
        aciklama: "Turuncu beyaz çizgileriyle dayanıklıdır. Yeni başlayanlar için çok rahat.",
        ustRenk: "#ff6a43",
        ortaRenk: "#ff8759",
        altRenk: "#ffd6b5",
        yuzgecRenk: "#f04c8d",
        kuyrukRenk: "#ff6a8a",
        vurguRenk: "#fff3e0",
        cizgiRenk: "#fff7ef",
        hiz: 4.8,
        can: 4,
        bonus: "+1 Can",
        boyut: 0.86,
        zehirBekleme: 29,
        zehirHasar: 1,
        gozRenk: "#84ff52"
    },
    {
        ad: "Neon Kirpi",
        aciklama: "Yuvarlak yapılıdır, zehirini hızlı gönderir ve canavara karşı iyidir.",
        ustRenk: "#ff8c7a",
        ortaRenk: "#ff9170",
        altRenk: "#ffd9bf",
        yuzgecRenk: "#ff7ca8",
        kuyrukRenk: "#f36b8d",
        vurguRenk: "#fff1da",
        cizgiRenk: "#e57f68",
        hiz: 5.3,
        can: 3,
        bonus: "Hızlı Zehir",
        boyut: 0.84,
        zehirBekleme: 17,
        zehirHasar: 1,
        gozRenk: "#ff6262",
        puffer: true
    }
];

let seciliBalikIndex = 0;
let seciliBalik = balikSecenekleri[0];

let tuslar = {};
let oyunCalisiyor = false;
let oyunBitti = false;
let oyunDuraklatildi = false;
let secimAktif = true;

let skor = 0;
let enYuksekSkor = Number(localStorage.getItem("enYuksekSkor")) || 0;
let can = 3;
let maksimumCan = 5;
let mesafe = 0;
let seviye = 1;
let zaman = 0;

let hasarKorumaSuresi = 0;
let zehirBeklemeSayaci = 0;
let zehirGucluSuresi = 0;
let yavaslatmaSuresi = 0;
let kalkanVar = false;

let sonCanavarZamani = 0;
let canavarAraligi = 720; // 60 FPS'te yaklaşık 12 saniye. Test için 300 yapabilirsin.

let animasyonId = null;
let audioContext = null;
let muzikTimer = null;
let muzikAcik = false;

let oyuncu = {
    x: 170,
    y: 255,
    genislik: 70,
    yukseklik: 40,
    hiz: 5,
    yon: 1
};

let yavruBalik = {
    x: 80,
    y: 285,
    genislik: 42,
    yukseklik: 26,
    aktif: true
};

let yem = {
    x: 760,
    y: 210,
    genislik: 34,
    yukseklik: 34
};

let canavar = {
    aktif: false,
    x: canvas.width + 200,
    y: 220,
    genislik: 150,
    yukseklik: 88,
    hiz: 1.5,
    can: 5,
    maksimumCan: 5,
    salinim: 0
};

let kancalar = [];
let zehirler = [];
let guclendirmeler = [];
let kabarciklar = [];
let dekorlar = [];
let arkaBaliklar = [];
let parcalar = [];
let yaziEfektleri = [];
let seviyeBildirim = {
    aktif: false,
    metin: "",
    sure: 0,
    maksimumSure: 120
};

document.addEventListener("keydown", function(e) {

    if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.code === "Space"
    ) {
        e.preventDefault();
    }

    tuslar[e.key] = true;

    if (e.code === "Space") {

        if (oyunCalisiyor && !oyunDuraklatildi) {
            zehirFirlat();
        }
    }

    if (secimAktif) {

        if (e.key === "ArrowLeft") {
            oncekiBalik();
        }

        if (e.key === "ArrowRight") {
            sonrakiBalik();
        }

        if (e.key === "Enter") {
            seciliBaliklaBaslat();
        }
    }
});

document.addEventListener("keyup", function(e) {
    tuslar[e.key] = false;
});

oncekiBalikButonu.addEventListener("click", oncekiBalik);
sonrakiBalikButonu.addEventListener("click", sonrakiBalik);
balikSecButonu.addEventListener("click", seciliBaliklaBaslat);
oyunuBaslatButonu.addEventListener("click", oyunuBaslat);
oyunuYenidenBaslatButonu.addEventListener("click", oyunuYenidenBaslat);
oyunuDondurButonu.addEventListener("click", oyunuDondurDevamEt);
karakterSecButonu.addEventListener("click", karakterSecimineDon);
muzikButonu.addEventListener("click", muzikDurumunuDegistir);

function oncekiBalik() {
    seciliBalikIndex--;

    if (seciliBalikIndex < 0) {
        seciliBalikIndex = balikSecenekleri.length - 1;
    }

    secimEkraniniGuncelle();
}

function sonrakiBalik() {
    seciliBalikIndex++;

    if (seciliBalikIndex >= balikSecenekleri.length) {
        seciliBalikIndex = 0;
    }

    secimEkraniniGuncelle();
}

function secimEkraniniGuncelle() {
    seciliBalik = balikSecenekleri[seciliBalikIndex];

    secimBalikAdi.textContent = seciliBalik.ad;
    secimAciklama.textContent = seciliBalik.aciklama;
    secimHiz.textContent = seciliBalik.hiz;
    secimCan.textContent = seciliBalik.can;
    secimBonus.textContent = seciliBalik.bonus;
    balikAdiYazisi.textContent = seciliBalik.ad;

    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewArkaPlanCiz();
    gercekciBalikCiz(previewCtx, 110, 78, seciliBalik.boyut * 1.35, seciliBalik, 1, false);
}

function previewArkaPlanCiz() {
    const gradient = previewCtx.createLinearGradient(0, 0, 0, previewCanvas.height);
    gradient.addColorStop(0, "#4da4ff");
    gradient.addColorStop(0.55, "#2467c9");
    gradient.addColorStop(1, "#19479f");

    previewCtx.fillStyle = gradient;
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    previewCtx.fillStyle = "rgba(85, 165, 255, 0.2)";
    previewCtx.beginPath();
    previewCtx.moveTo(0, 24);
    previewCtx.quadraticCurveTo(55, 8, 120, 18);
    previewCtx.quadraticCurveTo(180, 28, 220, 14);
    previewCtx.lineTo(220, 42);
    previewCtx.lineTo(0, 42);
    previewCtx.closePath();
    previewCtx.fill();

    previewCtx.fillStyle = "#ead8aa";
    previewCtx.fillRect(0, previewCanvas.height - 26, previewCanvas.width, 26);

    miniMercanCiz(previewCtx, 22, previewCanvas.height - 22, 30, "#ff88be");
    miniMercanCiz(previewCtx, 196, previewCanvas.height - 20, 26, "#7cffd6");
    miniYosunCiz(previewCtx, 42, previewCanvas.height - 14, 28, "#6bd252", 0.5);
    miniYosunCiz(previewCtx, 184, previewCanvas.height - 14, 34, "#70d65a", 0.8);

    previewCtx.strokeStyle = "rgba(255,255,255,0.18)";
    previewCtx.lineWidth = 2;
    for (let y = 30; y < previewCanvas.height - 35; y += 38) {
        previewCtx.beginPath();
        for (let x = 0; x <= previewCanvas.width; x += 10) {
            const yy = y + Math.sin((x + zaman) * 0.03) * 3;
            if (x === 0) {
                previewCtx.moveTo(x, yy);
            } else {
                previewCtx.lineTo(x, yy);
            }
        }
        previewCtx.stroke();
    }
}

function seciliBaliklaBaslat() {
    secimAktif = false;
    secimEkrani.classList.add("gizli");
    oyunuYenidenBaslat(true);
}

function oyunuBaslat() {
    if (secimAktif) {
        durumYazisi.textContent = "Önce balık seçmelisin.";
        return;
    }

    if (!oyunBitti) {
        oyunCalisiyor = true;
        oyunDuraklatildi = false;
        oyunuDondurButonu.textContent = "Dondur";
        durumYazisi.textContent = "Oyun devam ediyor.";
    }
}

function oyunuDondurDevamEt() {
    if (secimAktif || oyunBitti) {
        return;
    }

    oyunDuraklatildi = !oyunDuraklatildi;
    oyunCalisiyor = !oyunDuraklatildi;

    if (oyunDuraklatildi) {
        oyunuDondurButonu.textContent = "Devam Et";
        oyunuDondurButonu.classList.add("duraklatildi");
        durumYazisi.textContent = "Oyun duraklatıldı.";
    } else {
        oyunuDondurButonu.textContent = "Dondur";
        oyunuDondurButonu.classList.remove("duraklatildi");
        durumYazisi.textContent = "Oyun devam ediyor.";
    }
}

function karakterSecimineDon() {
    oyunCalisiyor = false;
    oyunBitti = false;
    oyunDuraklatildi = false;
    secimAktif = true;

    oyunuDondurButonu.textContent = "Dondur";
    oyunuDondurButonu.classList.remove("duraklatildi");

    secimEkrani.classList.remove("gizli");
    durumYazisi.textContent = "Balık seç.";
    secimEkraniniGuncelle();
}

function oyunuYenidenBaslat(secimdenBaslatildi = false) {
    if (oyunBitti && !secimdenBaslatildi) {
        karakterSecimineDon();
        return;
    }

    skor = 0;
    can = seciliBalik.can;
    mesafe = 0;
    seviye = 1;
    zaman = 0;

    hasarKorumaSuresi = 0;
    zehirBeklemeSayaci = 0;
    zehirGucluSuresi = 0;
    yavaslatmaSuresi = 0;
    kalkanVar = false;

    sonCanavarZamani = 0;
    canavarAraligi = 720;

    oyunCalisiyor = true;
    oyunBitti = false;
    oyunDuraklatildi = false;
    secimAktif = false;

    secimEkrani.classList.add("gizli");

    oyunuDondurButonu.textContent = "Dondur";
    oyunuDondurButonu.classList.remove("duraklatildi");

    oyuncu.x = 170;
    oyuncu.y = 255;
    oyuncu.hiz = seciliBalik.hiz;
    oyuncu.genislik = 70 * seciliBalik.boyut;
    oyuncu.yukseklik = 40 * seciliBalik.boyut;
    oyuncu.yon = 1;

    yavruBalik.x = 82;
    yavruBalik.y = 285;
    yavruBalik.aktif = true;

    yem.x = rastgeleSayi(640, canvas.width - 80);
    yem.y = rastgeleSayi(80, canvas.height - 120);

    canavar.aktif = false;

    kancalariOlustur();
    kabarciklariOlustur();
    dekorlariOlustur();
    arkaBaliklariOlustur();

    zehirler = [];
    guclendirmeler = [];
    parcalar = [];
    yaziEfektleri = [];
    seviyeBildirim.aktif = false;
    seviyeBildirim.metin = "";
    seviyeBildirim.sure = 0;

    ekranBilgileriniGuncelle();
    durumYazisi.textContent = "Oyun başladı. Space ile zehir fırlat.";

    oyunDongusunuBaslat();
}

function oyunDongusunuBaslat() {
    if (animasyonId !== null) {
        cancelAnimationFrame(animasyonId);
    }

    animasyonId = requestAnimationFrame(oyunDongusu);
}

function kancalariOlustur() {
    kancalar = [];

    for (let i = 0; i < 6; i++) {
        kancalar.push({
            x: rastgeleSayi(canvas.width + 80, canvas.width + 900),
            y: rastgeleSayi(45, canvas.height - 105),
            genislik: 36,
            yukseklik: 58,
            hiz: rastgeleSayi(3, 5),
            salinim: Math.random() * Math.PI * 2
        });
    }
}

function kabarciklariOlustur() {
    kabarciklar = [];

    for (let i = 0; i < 45; i++) {
        kabarciklar.push({
            x: rastgeleSayi(0, canvas.width),
            y: rastgeleSayi(0, canvas.height),
            r: rastgeleSayi(3, 10),
            hiz: Math.random() * 1.4 + 0.4,
            saydamlik: Math.random() * 0.25 + 0.12
        });
    }
}

function dekorlariOlustur() {
    dekorlar = [];
    const tipler = ["yosun", "kabuk", "mercan", "denizyildizi", "tas", "sunger"];
    const renkler = ["#40c463", "#89d84b", "#ff7bac", "#ffce5f", "#7be7ff", "#ad8cff", "#ff9966"];

    for (let i = 0; i < 34; i++) {
        dekorlar.push({
            x: rastgeleSayi(0, canvas.width * 2),
            y: rastgeleSayi(canvas.height - 78, canvas.height - 14),
            tip: tipler[rastgeleSayi(0, tipler.length - 1)],
            boy: rastgeleSayi(16, 64),
            hiz: Math.random() * 0.8 + 1.1,
            renk: renkler[rastgeleSayi(0, renkler.length - 1)]
        });
    }
}

function arkaBaliklariOlustur() {
    arkaBaliklar = [];
    const renkler = ["#c6f6ff", "#ffe27d", "#ffb0c8", "#b7ffd6", "#d4c1ff"];

    for (let i = 0; i < 14; i++) {
        arkaBaliklar.push({
            x: rastgeleSayi(0, canvas.width),
            y: rastgeleSayi(70, canvas.height - 160),
            hiz: Math.random() * 0.9 + 0.6,
            boyut: Math.random() * 0.45 + 0.35,
            renk: renkler[rastgeleSayi(0, renkler.length - 1)]
        });
    }
}

function oyuncuyuHareketEttir() {
    if (tuslar["ArrowUp"] || tuslar["w"] || tuslar["W"]) {
        oyuncu.y -= oyuncu.hiz;
    }

    if (tuslar["ArrowDown"] || tuslar["s"] || tuslar["S"]) {
        oyuncu.y += oyuncu.hiz;
    }

    if (tuslar["ArrowLeft"] || tuslar["a"] || tuslar["A"]) {
        oyuncu.x -= oyuncu.hiz;
        oyuncu.yon = -1;
    }

    if (tuslar["ArrowRight"] || tuslar["d"] || tuslar["D"]) {
        oyuncu.x += oyuncu.hiz;
        oyuncu.yon = 1;
    }

    oyuncu.x = sinirla(oyuncu.x, 10, canvas.width - oyuncu.genislik - 10);
    oyuncu.y = sinirla(oyuncu.y, 35, canvas.height - oyuncu.yukseklik - 55);
}

function yavruBaligiHareketEttir() {
    if (!yavruBalik.aktif) {
        return;
    }

    yavruBalik.x += (oyuncu.x - yavruBalik.x - 72) * 0.035;
    yavruBalik.y += (oyuncu.y - yavruBalik.y + 10) * 0.035;

    yavruBalik.x = sinirla(yavruBalik.x, 5, canvas.width - yavruBalik.genislik - 5);
    yavruBalik.y = sinirla(yavruBalik.y, 45, canvas.height - yavruBalik.yukseklik - 55);
}

function kancalariHareketEttir() {
    const yavasCarpani = yavaslatmaSuresi > 0 ? 0.45 : 1;
    const hizBonusu = 1 + seviye * 0.18;

    for (let i = 0; i < kancalar.length; i++) {
        const kanca = kancalar[i];

        kanca.x -= (kanca.hiz + hizBonusu) * yavasCarpani;
        kanca.salinim += 0.04;
        kanca.y += Math.sin(kanca.salinim) * 0.9;

        if (kanca.x < -90) {
            kancayiYenile(kanca);
        }
    }
}

function kancayiYenile(kanca) {
    kanca.x = rastgeleSayi(canvas.width + 90, canvas.width + 700);
    kanca.y = rastgeleSayi(45, canvas.height - 115);
    kanca.hiz = rastgeleSayi(3, 5) + Math.floor(seviye / 3);
    kanca.salinim = Math.random() * Math.PI * 2;
}

function yemHareketEttir() {
    yem.x -= 3 + seviye * 0.35;

    if (yem.x < -60) {
        yemiYenile();
    }
}

function yemiYenile() {
    yem.x = rastgeleSayi(canvas.width + 80, canvas.width + 460);
    yem.y = rastgeleSayi(70, canvas.height - 120);
}

function canavarKontrolEt() {
    if (!canavar.aktif) {
        if (zaman - sonCanavarZamani >= canavarAraligi) {
            canavarOlustur();
            sonCanavarZamani = zaman;
            canavarAraligi = Math.max(420, 900 - seviye * 55);
        }

        return;
    }

    const yavasCarpani = yavaslatmaSuresi > 0 ? 0.45 : 1;

    canavar.salinim += 0.04;
    canavar.x -= (canavar.hiz + seviye * 0.08) * yavasCarpani;
    canavar.y += Math.sin(canavar.salinim) * 1.2;
    canavar.y += (oyuncu.y - canavar.y) * 0.006;

    canavar.y = sinirla(canavar.y, 55, canvas.height - 145);

    if (canavar.x < -190) {
        canavar.aktif = false;
        sonCanavarZamani = zaman;
    }
}

function canavarOlustur() {
    canavar.aktif = true;
    canavar.x = canvas.width + 150;
    canavar.y = rastgeleSayi(90, canvas.height - 170);
    canavar.maksimumCan = 4 + Math.floor(seviye / 2);
    canavar.can = canavar.maksimumCan;
    canavar.hiz = 1.35 + seviye * 0.08;
    canavar.salinim = Math.random() * Math.PI * 2;

    durumYazisi.textContent = "Canavar balık geldi! Space ile zehir fırlat.";
}

function zehirFirlat() {
    if (zehirBeklemeSayaci > 0) {
        return;
    }

    const gucluMu = zehirGucluSuresi > 0;
    const hasar = seciliBalik.zehirHasar + (gucluMu ? 1 : 0);

    zehirler.push({
        x: oyuncu.x + oyuncu.genislik - 4,
        y: oyuncu.y + oyuncu.yukseklik / 2,
        genislik: gucluMu ? 26 : 17,
        yukseklik: gucluMu ? 26 : 17,
        hiz: gucluMu ? 11 : 9,
        hasar,
        guclu: gucluMu
    });

    zehirBeklemeSayaci = seciliBalik.zehirBekleme;
}

function zehirleriHareketEttir() {
    for (let i = zehirler.length - 1; i >= 0; i--) {
        const z = zehirler[i];

        z.x += z.hiz;

        if (z.x > canvas.width + 50) {
            zehirler.splice(i, 1);
        }
    }
}

function guclendirmeKontrolEt() {
    if (guclendirmeler.length < 2 && Math.random() < 0.006) {
        guclendirmeOlustur();
    }

    for (let i = guclendirmeler.length - 1; i >= 0; i--) {
        const g = guclendirmeler[i];

        g.x -= 3 + seviye * 0.2;
        g.aci += 0.04;

        if (g.x < -50) {
            guclendirmeler.splice(i, 1);
        }
    }
}

function guclendirmeOlustur() {
    const rastgele = Math.random();
    let tip;

    if (rastgele < 0.32) {
        tip = "kalkan";
    } else if (rastgele < 0.62) {
        tip = "zehir";
    } else if (rastgele < 0.82) {
        tip = "yavaslat";
    } else {
        tip = "can";
    }

    guclendirmeler.push({
        tip,
        x: canvas.width + rastgeleSayi(80, 500),
        y: rastgeleSayi(75, canvas.height - 125),
        genislik: 38,
        yukseklik: 38,
        aci: 0
    });
}

function carpismaKontrolEt() {
    for (let i = 0; i < kancalar.length; i++) {
        const kanca = kancalar[i];

        if (hasarKorumaSuresi <= 0 && carpismaVarMi(oyuncu, kanca, 14)) {
            hasarAl("Balık kancaya çarptı!");
            kancayiYenile(kanca);
        }

        if (hasarKorumaSuresi <= 0 && yavruBalik.aktif && carpismaVarMi(yavruBalik, kanca, 8)) {
            yavruBalik.aktif = false;
            hasarAl("Yavru balık korunamadı!");
            kancayiYenile(kanca);
        }
    }

    if (carpismaVarMi(oyuncu, yem, 6)) {
        skor += 10;
        yaziEfektiEkle("+10", yem.x, yem.y, "#ffe66d");
        efektOlustur(yem.x + 15, yem.y + 15, "#ffd75a");
        yemiYenile();
    }

    for (let i = guclendirmeler.length - 1; i >= 0; i--) {
        const g = guclendirmeler[i];

        if (carpismaVarMi(oyuncu, g, 4)) {
            guclendirmeUygula(g.tip, g.x, g.y);
            guclendirmeler.splice(i, 1);
        }
    }

    if (canavar.aktif && hasarKorumaSuresi <= 0 && carpismaVarMi(oyuncu, canavar, 22)) {
        hasarAl("Canavar balık saldırdı!");
        canavar.aktif = false;
    }

    if (canavar.aktif && yavruBalik.aktif && hasarKorumaSuresi <= 0 && carpismaVarMi(yavruBalik, canavar, 12)) {
        yavruBalik.aktif = false;
        hasarAl("Canavar yavru balığa saldırdı!");
    }

    if (canavar.aktif) {
        for (let i = zehirler.length - 1; i >= 0; i--) {
            const z = zehirler[i];

            if (carpismaVarMi(z, canavar, 4)) {
                canavar.can -= z.hasar;
                efektOlustur(z.x, z.y, z.guclu ? "#7dff65" : "#3ce86f");
                yaziEfektiEkle("-" + z.hasar, canavar.x + 30, canavar.y, "#9dff7a");
                zehirler.splice(i, 1);

                if (canavar.can <= 0) {
                    canavarOldur();
                }

                break;
            }
        }
    }
}

function guclendirmeUygula(tip, x, y) {
    if (tip === "kalkan") {
        if (can < maksimumCan) {
            can++;
            yaziEfektiEkle("+1 CAN", x, y, "#ff6b8a");
            durumYazisi.textContent = "Kalkan topladın: can kazandın.";
        } else {
            kalkanVar = true;
            yaziEfektiEkle("KALKAN", x, y, "#6dd6ff");
            durumYazisi.textContent = "Kalkan aktif: sonraki hasarı engeller.";
        }
    }

    if (tip === "zehir") {
        zehirGucluSuresi = 600;
        yaziEfektiEkle("GÜÇLÜ ZEHİR", x, y, "#65ff6a");
        durumYazisi.textContent = "Zehir güçlendi: canavara daha fazla hasar verir.";
    }

    if (tip === "yavaslat") {
        yavaslatmaSuresi = 480;
        yaziEfektiEkle("YAVAŞLATMA", x, y, "#a8ecff");
        durumYazisi.textContent = "Düşmanlar yavaşladı.";
    }

    if (tip === "can") {
        can = Math.min(maksimumCan, can + 1);
        yaziEfektiEkle("+1 CAN", x, y, "#ff6b8a");
        durumYazisi.textContent = "Ekstra can topladın.";
    }

    efektOlustur(x + 18, y + 18, "#ffffff");
    ekranBilgileriniGuncelle();
}

function canavarOldur() {
    skor += 50;
    yaziEfektiEkle("+50 CANAVAR", canavar.x, canavar.y, "#ffdf6b");
    efektOlustur(canavar.x + 60, canavar.y + 35, "#ff784f");
    canavar.aktif = false;
    sonCanavarZamani = zaman;
    durumYazisi.textContent = "Canavar balığı zehirle yendin!";
}

function hasarAl(mesaj) {
    if (kalkanVar) {
        kalkanVar = false;
        hasarKorumaSuresi = 80;
        yaziEfektiEkle("KALKAN KIRILDI", oyuncu.x, oyuncu.y, "#6dd6ff");
        efektOlustur(oyuncu.x + oyuncu.genislik / 2, oyuncu.y + oyuncu.yukseklik / 2, "#6dd6ff");
        durumYazisi.textContent = "Kalkan hasarı engelledi.";
        return;
    }

    can--;
    hasarKorumaSuresi = 100;
    yaziEfektiEkle("-1 CAN", oyuncu.x, oyuncu.y, "#ff5c5c");
    efektOlustur(oyuncu.x + oyuncu.genislik / 2, oyuncu.y + oyuncu.yukseklik / 2, "#ff5c5c");

    if (can <= 0) {
        oyunuBitir("Kaybettin! " + mesaj);
    } else {
        durumYazisi.textContent = mesaj + " Kısa süre korumalısın.";
    }

    ekranBilgileriniGuncelle();
}

function oyunBilgileriniGuncelle() {
    zaman++;
    mesafe += 0.12 + seviye * 0.015;

    const yeniSeviye = Math.floor(mesafe / 120) + 1;

    if (yeniSeviye !== seviye) {
        seviye = yeniSeviye;
        seviyeBildirim.aktif = true;
        seviyeBildirim.metin = "SEVİYE " + seviye;
        seviyeBildirim.sure = seviyeBildirim.maksimumSure;
        yaziEfektiEkle("SEVİYE " + seviye, canvas.width / 2 - 40, 90, "#ffffff");
        durumYazisi.textContent = "Seviye " + seviye + "! Düşmanlar hızlandı.";
    }

    if (hasarKorumaSuresi > 0) {
        hasarKorumaSuresi--;
    }

    if (zehirBeklemeSayaci > 0) {
        zehirBeklemeSayaci--;
    }

    if (zehirGucluSuresi > 0) {
        zehirGucluSuresi--;
    }

    if (yavaslatmaSuresi > 0) {
        yavaslatmaSuresi--;
    }

    if (seviyeBildirim.sure > 0) {
        seviyeBildirim.sure--;
        if (seviyeBildirim.sure <= 0) {
            seviyeBildirim.aktif = false;
        }
    }

    for (let i = parcalar.length - 1; i >= 0; i--) {
        const p = parcalar[i];

        p.x += p.vx;
        p.y += p.vy;
        p.omur--;

        if (p.omur <= 0) {
            parcalar.splice(i, 1);
        }
    }

    for (let i = yaziEfektleri.length - 1; i >= 0; i--) {
        const y = yaziEfektleri[i];

        y.y -= 0.8;
        y.omur--;

        if (y.omur <= 0) {
            yaziEfektleri.splice(i, 1);
        }
    }

    ekranBilgileriniGuncelle();
}

function arkaPlanNesneleriniHareketEttir() {
    for (let i = 0; i < kabarciklar.length; i++) {
        const b = kabarciklar[i];

        b.y -= b.hiz;
        b.x -= 0.15;

        if (b.y < -20) {
            b.y = canvas.height + 20;
            b.x = rastgeleSayi(0, canvas.width);
        }
    }

    for (let i = 0; i < dekorlar.length; i++) {
        const d = dekorlar[i];

        d.x -= d.hiz + seviye * 0.05;

        if (d.x < -80) {
            d.x = canvas.width + rastgeleSayi(0, 520);
            d.y = rastgeleSayi(canvas.height - 65, canvas.height - 18);
        }
    }

    for (let i = 0; i < arkaBaliklar.length; i++) {
        const f = arkaBaliklar[i];

        f.x -= f.hiz;

        if (f.x < -70) {
            f.x = canvas.width + rastgeleSayi(20, 240);
            f.y = rastgeleSayi(70, canvas.height - 150);
        }
    }
}
function enYuksekSkoruKontrolEt() {
    if (skor > enYuksekSkor) {
        enYuksekSkor = skor;
        localStorage.setItem("enYuksekSkor", enYuksekSkor);
    }
}

function ekranBilgileriniGuncelle() {
    if (skor > enYuksekSkor) {
        enYuksekSkor = skor;
        localStorage.setItem("enYuksekSkor", enYuksekSkor);
    }

    canYazisi.textContent = can;
    skorYazisi.textContent = skor;
    enYuksekSkorYazisi.textContent = enYuksekSkor;
    mesafeYazisi.textContent = Math.floor(mesafe) + " m";
    seviyeYazisi.textContent = seviye;
    balikAdiYazisi.textContent = seciliBalik.ad;
}

function oyunuBitir(mesaj) {
    oyunCalisiyor = false;
    oyunBitti = true;
    oyunDuraklatildi = false;
    oyunuDondurButonu.textContent = "Dondur";
    oyunuDondurButonu.classList.remove("duraklatildi");
    durumYazisi.textContent = mesaj + " Yeniden Başlat'a basarsan tekrar balık seçersin.";
}

function carpismaVarMi(nesne1, nesne2, pay = 0) {
    return (
        nesne1.x + pay < nesne2.x + nesne2.genislik - pay &&
        nesne1.x + nesne1.genislik - pay > nesne2.x + pay &&
        nesne1.y + pay < nesne2.y + nesne2.yukseklik - pay &&
        nesne1.y + nesne1.yukseklik - pay > nesne2.y + pay
    );
}

function ekraniCiz() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    arkaPlanCiz();
    dekorlariCiz();
    arkaBaliklariCiz();
    kabarciklariCiz();
    yemCiz();
    guclendirmeleriCiz();
    zehirleriCiz();
    kancalariCiz();
    canavarCiz();
    yavruBalikCiz();
    oyuncuCiz();
    parcalariCiz();
    yaziEfektleriniCiz();
    seviyeBildiriminiCiz();
    oyunArayuzunuCiz();

    if (oyunDuraklatildi) {
        duraklatildiYazisiCiz();
    }

    if (oyunBitti) {
        oyunSonuYazisiCiz();
    }
}

function arkaPlanCiz() {
    const gradyan = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradyan.addColorStop(0, "#356fdb");
    gradyan.addColorStop(0.42, "#2f66c2");
    gradyan.addColorStop(0.72, "#2555ad");
    gradyan.addColorStop(1, "#163f90");

    ctx.fillStyle = gradyan;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dalgaRenkleri = [
        { renk: "rgba(91, 153, 255, 0.18)", y: 35, h: 42, ofset: 0 },
        { renk: "rgba(67, 135, 242, 0.16)", y: 85, h: 36, ofset: 55 },
        { renk: "rgba(80, 169, 255, 0.12)", y: 140, h: 34, ofset: 110 }
    ];

    for (const katman of dalgaRenkleri) {
        ctx.fillStyle = katman.renk;
        ctx.beginPath();
        ctx.moveTo(-40, katman.y + 10);
        for (let x = -40; x <= canvas.width + 40; x += 30) {
            const y = katman.y + Math.sin((x + zaman * 0.9 + katman.ofset) * 0.015) * katman.h;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width + 40, katman.y + 80);
        ctx.lineTo(-40, katman.y + 80);
        ctx.closePath();
        ctx.fill();
    }

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#0e2e79";
    for (let i = 0; i < 12; i++) {
        const x = (i * 92 + (zaman * 0.5) % 140) % (canvas.width + 120) - 60;
        basitBalikCiz(x, 165 + (i % 3) * 26, 18 + (i % 4) * 3, "#0e2e79");
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2.5;
    for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        for (let x = -40; x <= canvas.width + 40; x += 12) {
            const y = 52 + j * 52 + Math.sin((x + zaman * (1.4 + j * 0.18)) * 0.018) * (8 + j * 1.1);
            if (x === -40) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = "#e9d3a0";
    ctx.fillRect(0, canvas.height - 52, canvas.width, 52);

    ctx.fillStyle = "rgba(190, 160, 120, 0.45)";
    for (let i = 0; i < 22; i++) {
        const px = (i * 43 + 15) % canvas.width;
        ctx.beginPath();
        ctx.arc(px, canvas.height - 18 - (i % 3) * 5, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
    }
}

function dekorlariCiz() {
    for (let i = 0; i < dekorlar.length; i++) {
        const d = dekorlar[i];

        if (d.tip === "yosun") {
            yosunCiz(d.x, d.y, d.boy, d.renk, i);
        } else if (d.tip === "kabuk") {
            kabukCiz(d.x, d.y, d.boy * 0.45, d.renk);
        } else if (d.tip === "mercan") {
            mercanCiz(d.x, d.y, d.boy, d.renk);
        } else if (d.tip === "denizyildizi") {
            denizYildiziCiz(d.x, d.y, d.boy * 0.28, d.renk);
        } else if (d.tip === "tas") {
            tasCiz(d.x, d.y, d.boy * 0.38);
        } else if (d.tip === "sunger") {
            sungerCiz(d.x, d.y, d.boy * 0.36, d.renk);
        }
    }
}

function yosunCiz(x, y, boy, renk, index) {
    ctx.save();
    ctx.strokeStyle = renk;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 7, y + 30);
        ctx.quadraticCurveTo(
            x + Math.sin(zaman * 0.04 + index + i) * 14,
            y + 10,
            x + i * 8,
            y + 30 - boy
        );
        ctx.stroke();
    }

    ctx.restore();
}

function kabukCiz(x, y, r, renk) {
    ctx.save();

    ctx.fillStyle = renk;
    ctx.beginPath();
    ctx.arc(x, y + 8, r, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(80,50,30,0.35)";
    ctx.lineWidth = 2;

    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + 8);
        ctx.lineTo(x + i * r * 0.35, y - r * 0.7);
        ctx.stroke();
    }

    ctx.restore();
}

function mercanCiz(x, y, boy, renk) {
    ctx.save();
    ctx.strokeStyle = renk;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x, y - boy);
    ctx.moveTo(x, y - boy * 0.45);
    ctx.lineTo(x - 16, y - boy * 0.65);
    ctx.moveTo(x, y - boy * 0.58);
    ctx.lineTo(x + 18, y - boy * 0.82);
    ctx.stroke();

    ctx.restore();
}

function arkaBaliklariCiz() {
    ctx.save();
    ctx.globalAlpha = 0.32;

    for (let i = 0; i < arkaBaliklar.length; i++) {
        const f = arkaBaliklar[i];
        basitBalikCiz(f.x, f.y, 35 * f.boyut, f.renk);
    }

    ctx.restore();
}

function basitBalikCiz(x, y, boy, renk) {
    ctx.fillStyle = renk;
    ctx.beginPath();
    ctx.ellipse(x, y, boy, boy * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + boy * 0.78, y);
    ctx.quadraticCurveTo(x + boy * 1.18, y - boy * 0.34, x + boy * 1.38, y - boy * 0.1);
    ctx.quadraticCurveTo(x + boy * 1.08, y, x + boy * 1.38, y + boy * 0.1);
    ctx.quadraticCurveTo(x + boy * 1.18, y + boy * 0.34, x + boy * 0.78, y);
    ctx.fill();
}

function kabarciklariCiz() {
    ctx.save();

    for (let i = 0; i < kabarciklar.length; i++) {
        const b = kabarciklar[i];

        ctx.globalAlpha = b.saydamlik;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
}

function oyuncuCiz() {
    const gorunsunMu = hasarKorumaSuresi <= 0 || Math.floor(hasarKorumaSuresi / 8) % 2 === 0;

    if (!gorunsunMu) {
        return;
    }

    if (kalkanVar) {
        ctx.save();
        ctx.strokeStyle = "rgba(120,220,255,0.95)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
            oyuncu.x + oyuncu.genislik / 2,
            oyuncu.y + oyuncu.yukseklik / 2,
            43 * seciliBalik.boyut,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
    }

    gercekciBalikCiz(
        ctx,
        oyuncu.x + oyuncu.genislik / 2,
        oyuncu.y + oyuncu.yukseklik / 2,
        seciliBalik.boyut,
        seciliBalik,
        oyuncu.yon,
        true
    );
}

function yavruBalikCiz() {
    if (!yavruBalik.aktif) {
        return;
    }

    const yavruStil = {
        ustRenk: "#bf4c95",
        ortaRenk: "#ff8fd6",
        altRenk: "#ffe2f4",
        yuzgecRenk: "#d65aa8",
        kuyrukRenk: "#c84c9d"
    };

    gercekciBalikCiz(
        ctx,
        yavruBalik.x + yavruBalik.genislik / 2,
        yavruBalik.y + yavruBalik.yukseklik / 2,
        0.46,
        yavruStil,
        1,
        false
    );
}

function gercekciBalikCiz(cizimCtx, x, y, olcek, stil, yon, detay) {
    const yonCarpani = yon || 1;
    const puffer = stil.puffer === true;
    const govdeW = (puffer ? 44 : 56) * olcek;
    const govdeH = (puffer ? 34 : 22) * olcek;
    const kuyrukW = (puffer ? 12 : 24) * olcek;
    const kuyrukH = (puffer ? 14 : 23) * olcek;
    const gozRenk = stil.gozRenk || "#ff9933";
    const vurguRenk = stil.vurguRenk || "rgba(255,255,255,0.55)";
    const cizgiRenk = stil.cizgiRenk || "rgba(255,255,255,0.35)";

    cizimCtx.save();
    cizimCtx.translate(x, y);
    cizimCtx.scale(yonCarpani, 1);

    cizimCtx.fillStyle = "rgba(0,0,0,0.16)";
    cizimCtx.beginPath();
    cizimCtx.ellipse(5 * olcek, govdeH * 0.95, govdeW * 0.75, govdeH * 0.45, 0, 0, Math.PI * 2);
    cizimCtx.fill();

    const kuyrukGradient = cizimCtx.createLinearGradient(-govdeW - kuyrukW, 0, -govdeW + 6 * olcek, 0);
    kuyrukGradient.addColorStop(0, stil.kuyrukRenk);
    kuyrukGradient.addColorStop(0.65, stil.ustRenk);
    kuyrukGradient.addColorStop(1, stil.altRenk);
    cizimCtx.fillStyle = kuyrukGradient;
    cizimCtx.beginPath();
    cizimCtx.moveTo(-govdeW + 5 * olcek, 0);
    cizimCtx.quadraticCurveTo(-govdeW - kuyrukW * 0.15, -kuyrukH * 0.92, -govdeW - kuyrukW, -kuyrukH);
    cizimCtx.quadraticCurveTo(-govdeW - kuyrukW * 0.55, -kuyrukH * 0.1, -govdeW - 5 * olcek, 0);
    cizimCtx.quadraticCurveTo(-govdeW - kuyrukW * 0.55, kuyrukH * 0.1, -govdeW - kuyrukW, kuyrukH);
    cizimCtx.quadraticCurveTo(-govdeW - kuyrukW * 0.15, kuyrukH * 0.92, -govdeW + 5 * olcek, 0);
    cizimCtx.fill();

    const bodyGradient = cizimCtx.createLinearGradient(0, -govdeH, 0, govdeH);
    bodyGradient.addColorStop(0, stil.ustRenk);
    bodyGradient.addColorStop(0.55, stil.ortaRenk);
    bodyGradient.addColorStop(1, stil.altRenk);
    cizimCtx.fillStyle = bodyGradient;
    cizimCtx.beginPath();

    if (puffer) {
        cizimCtx.arc(-2 * olcek, 0, govdeH * 1.02, 0, Math.PI * 2);
    } else {
        cizimCtx.moveTo(-govdeW, 0);
        cizimCtx.bezierCurveTo(-govdeW * 0.64, -govdeH * 1.35, govdeW * 0.15, -govdeH * 1.18, govdeW * 0.82, -govdeH * 0.2);
        cizimCtx.quadraticCurveTo(govdeW * 1.06, 0, govdeW * 0.82, govdeH * 0.2);
        cizimCtx.bezierCurveTo(govdeW * 0.15, govdeH * 1.18, -govdeW * 0.64, govdeH * 1.35, -govdeW, 0);
    }
    cizimCtx.fill();

    cizimCtx.save();
    cizimCtx.clip();

    cizimCtx.fillStyle = "rgba(255,255,255,0.18)";
    cizimCtx.beginPath();
    cizimCtx.ellipse(govdeW * 0.2, -govdeH * 0.38, govdeW * 0.45, govdeH * 0.28, -0.2, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.strokeStyle = cizgiRenk;
    cizimCtx.lineWidth = 2 * olcek;
    const cizgiSayisi = puffer ? 4 : 5;
    for (let i = 0; i < cizgiSayisi; i++) {
        const sx = -govdeW * 0.4 + i * govdeW * 0.28;
        cizimCtx.beginPath();
        cizimCtx.moveTo(sx, -govdeH * 0.72);
        cizimCtx.quadraticCurveTo(sx + 8 * olcek, 0, sx, govdeH * 0.72);
        cizimCtx.stroke();
    }

    if (stil.ad === "Mercan Palyaço") {
        cizimCtx.fillStyle = "rgba(255,255,255,0.92)";
        for (let i = 0; i < 3; i++) {
            const bx = -govdeW * 0.2 + i * govdeW * 0.34;
            cizimCtx.beginPath();
            cizimCtx.roundRect ? cizimCtx.roundRect(bx, -govdeH * 0.95, 9 * olcek, govdeH * 1.9, 4 * olcek) : null;
            if (!cizimCtx.roundRect) {
                yuvarlatilmisDikdortgenCiz(cizimCtx, bx, -govdeH * 0.95, 9 * olcek, govdeH * 1.9, 4 * olcek);
            }
            cizimCtx.fill();
        }
    }

    if (puffer) {
        cizimCtx.strokeStyle = "rgba(255,190,160,0.95)";
        cizimCtx.lineWidth = 1.2 * olcek;
        for (let i = 0; i < 14; i++) {
            const angle = (Math.PI * 2 / 14) * i;
            const r1 = govdeH * 0.92;
            const r2 = govdeH * 1.18;
            cizimCtx.beginPath();
            cizimCtx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
            cizimCtx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
            cizimCtx.stroke();
        }
    }

    cizimCtx.restore();

    cizimCtx.fillStyle = stil.yuzgecRenk;
    cizimCtx.beginPath();
    cizimCtx.moveTo(-8 * olcek, -govdeH * 0.9);
    cizimCtx.quadraticCurveTo(8 * olcek, -govdeH * 1.75, 26 * olcek, -govdeH * 0.82);
    cizimCtx.quadraticCurveTo(7 * olcek, -govdeH * 0.95, -8 * olcek, -govdeH * 0.9);
    cizimCtx.fill();

    cizimCtx.beginPath();
    cizimCtx.moveTo(-8 * olcek, govdeH * 0.54);
    cizimCtx.quadraticCurveTo(2 * olcek, govdeH * 1.52, 22 * olcek, govdeH * 0.72);
    cizimCtx.quadraticCurveTo(6 * olcek, govdeH * 0.95, -8 * olcek, govdeH * 0.54);
    cizimCtx.fill();

    cizimCtx.fillStyle = vurguRenk;
    cizimCtx.beginPath();
    cizimCtx.ellipse(govdeW * 0.22, -govdeH * 0.38, govdeW * 0.28, govdeH * 0.14, -0.25, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.fillStyle = "white";
    cizimCtx.beginPath();
    cizimCtx.arc(govdeW * 0.58, -govdeH * 0.22, 8.6 * olcek, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.fillStyle = gozRenk;
    cizimCtx.beginPath();
    cizimCtx.arc(govdeW * 0.58, -govdeH * 0.22, 4.5 * olcek, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.fillStyle = "#121926";
    cizimCtx.beginPath();
    cizimCtx.arc(govdeW * 0.61, -govdeH * 0.22, 2.25 * olcek, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.fillStyle = "rgba(255,255,255,0.75)";
    cizimCtx.beginPath();
    cizimCtx.arc(govdeW * 0.54, -govdeH * 0.32, 1.4 * olcek, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.strokeStyle = "rgba(80,35,35,0.55)";
    cizimCtx.lineWidth = 1.8 * olcek;
    cizimCtx.beginPath();
    cizimCtx.arc(govdeW * 0.57, govdeH * 0.16, 7.5 * olcek, 0.12, 1.0);
    cizimCtx.stroke();

    cizimCtx.fillStyle = "rgba(255,255,255,0.45)";
    cizimCtx.beginPath();
    cizimCtx.arc(govdeW * 0.74, -govdeH * 0.02, 2 * olcek, 0, Math.PI * 2);
    cizimCtx.fill();

    cizimCtx.restore();
}

function yemCiz() {
    ctx.save();
    ctx.translate(yem.x + 17, yem.y + 17);
    ctx.rotate(Math.sin(zaman * 0.05) * 0.25);

    ctx.fillStyle = "#ffcf4a";
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff7a3d";
    ctx.beginPath();
    ctx.moveTo(-4, -2);
    ctx.lineTo(22, -14);
    ctx.lineTo(15, 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function guclendirmeleriCiz() {
    for (let i = 0; i < guclendirmeler.length; i++) {
        const g = guclendirmeler[i];

        ctx.save();
        ctx.translate(g.x + 19, g.y + 19);
        ctx.rotate(g.aci);

        ctx.fillStyle = "rgba(255,255,255,0.88)";
        yuvarlatilmisDikdortgenCiz(ctx, -22, -22, 44, 44, 10);
        ctx.fill();

        ctx.strokeStyle = "#0d5f7a";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.rotate(-g.aci);
        ctx.font = "26px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (g.tip === "kalkan") {
            ctx.fillText("🛡️", 0, 1);
        }

        if (g.tip === "zehir") {
            ctx.fillText("☣️", 0, 1);
        }

        if (g.tip === "yavaslat") {
            ctx.fillText("❄️", 0, 1);
        }

        if (g.tip === "can") {
            ctx.fillText("❤️", 0, 1);
        }

        ctx.restore();
    }
}

function zehirleriCiz() {
    for (let i = 0; i < zehirler.length; i++) {
        const z = zehirler[i];

        ctx.save();
        ctx.fillStyle = z.guclu ? "#7dff65" : "#34e76f";
        ctx.shadowColor = z.guclu ? "#baff9c" : "#62ff93";
        ctx.shadowBlur = z.guclu ? 18 : 10;

        ctx.beginPath();
        ctx.arc(z.x + z.genislik / 2, z.y, z.genislik / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function kancalariCiz() {
    for (let i = 0; i < kancalar.length; i++) {
        const k = kancalar[i];

        ctx.save();
        ctx.translate(k.x + k.genislik / 2, k.y);

        ctx.strokeStyle = "#edf7ff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(0, 14);
        ctx.stroke();

        ctx.strokeStyle = "#cfdbe5";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.bezierCurveTo(34, 16, 24, 62, -4, 51);
        ctx.bezierCurveTo(-20, 45, -18, 25, -4, 27);
        ctx.stroke();

        ctx.fillStyle = "#f1f7ff";
        ctx.beginPath();
        ctx.moveTo(-11, 25);
        ctx.lineTo(0, 8);
        ctx.lineTo(8, 28);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

function canavarCiz() {
    if (!canavar.aktif) {
        return;
    }

    ctx.save();
    ctx.translate(canavar.x + canavar.genislik / 2, canavar.y + canavar.yukseklik / 2);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(10, 24, 84, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyGradient = ctx.createLinearGradient(0, -60, 0, 60);
    bodyGradient.addColorStop(0, "#e4e2ff");
    bodyGradient.addColorStop(0.45, "#b0b7f8");
    bodyGradient.addColorStop(1, "#7a86d8");
    ctx.fillStyle = bodyGradient;

    ctx.beginPath();
    ctx.moveTo(-78, 0);
    ctx.bezierCurveTo(-44, -56, 56, -52, 94, -4);
    ctx.bezierCurveTo(58, 54, -46, 54, -78, 0);
    ctx.fill();

    ctx.fillStyle = "#8d95e6";
    ctx.beginPath();
    ctx.moveTo(82, 0);
    ctx.lineTo(122, -33);
    ctx.quadraticCurveTo(112, 0, 122, 33);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#b8beff";
    ctx.beginPath();
    ctx.moveTo(-8, -42);
    ctx.quadraticCurveTo(16, -75, 42, -30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-2, 34);
    ctx.quadraticCurveTo(18, 58, 44, 22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.28)";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const sx = -26 + i * 18;
        ctx.moveTo(sx, -28);
        ctx.quadraticCurveTo(sx + 8, 0, sx, 28);
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-32, -12, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffb53a";
    ctx.beginPath();
    ctx.arc(-30, -11, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a2038";
    ctx.beginPath();
    ctx.arc(-27, -11, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8c3d7d";
    ctx.beginPath();
    ctx.moveTo(-52, 8);
    ctx.quadraticCurveTo(-12, 38, 24, 14);
    ctx.quadraticCurveTo(-4, 44, -52, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 8; i++) {
        const tx = -46 + i * 9;
        ctx.beginPath();
        ctx.moveTo(tx, 8);
        ctx.lineTo(tx + 4, 22 + (i % 2) * 3);
        ctx.lineTo(tx + 8, 8);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
    canavarCanBariCiz();
}

function canavarCanBariCiz() {
    const barX = canavar.x + 15;
    const barY = canavar.y - 18;
    const barW = 115;
    const barH = 10;
    const oran = canavar.can / canavar.maksimumCan;

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = "#ff4b4b";
    ctx.fillRect(barX, barY, barW * oran, barH);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);
}

function parcalariCiz() {
    for (let i = 0; i < parcalar.length; i++) {
        const p = parcalar[i];

        ctx.save();
        ctx.globalAlpha = p.omur / 45;
        ctx.fillStyle = p.renk;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function yaziEfektleriniCiz() {
    for (let i = 0; i < yaziEfektleri.length; i++) {
        const y = yaziEfektleri[i];

        ctx.save();
        ctx.globalAlpha = y.omur / 70;
        ctx.fillStyle = y.renk;
        ctx.font = "bold 20px Arial";
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 4;
        ctx.strokeText(y.metin, y.x, y.y);
        ctx.fillText(y.metin, y.x, y.y);
        ctx.restore();
    }
}

function seviyeBildiriminiCiz() {
    if (!seviyeBildirim.aktif) {
        return;
    }

    const oran = seviyeBildirim.sure / seviyeBildirim.maksimumSure;
    let alpha = 1;
    if (oran < 0.25) {
        alpha = oran / 0.25;
    }
    let olcek = 1;
    if (oran > 0.7) {
        olcek = 1 + (oran - 0.7) * 0.75;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(12, 31, 84, 0.45)";
    ctx.fillRect(0, canvas.height / 2 - 90, canvas.width, 180);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(olcek, olcek);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const grd = ctx.createLinearGradient(0, -40, 0, 40);
    grd.addColorStop(0, "#fff6b8");
    grd.addColorStop(1, "#ffffff");
    ctx.fillStyle = grd;
    ctx.strokeStyle = "rgba(28, 66, 146, 0.95)";
    ctx.lineWidth = 9;
    ctx.font = "bold 64px Arial";
    ctx.strokeText(seviyeBildirim.metin, 0, -10);
    ctx.fillText(seviyeBildirim.metin, 0, -10);

    ctx.fillStyle = "#ffea78";
    ctx.strokeStyle = "rgba(28, 66, 146, 0.9)";
    ctx.lineWidth = 5;
    ctx.font = "bold 22px Arial";
    ctx.strokeText("Düşmanlar hızlandı!", 0, 48);
    ctx.fillText("Düşmanlar hızlandı!", 0, 48);
    ctx.restore();
}

function miniMercanCiz(cizimCtx, x, y, boy, renk) {
    cizimCtx.save();
    cizimCtx.strokeStyle = renk;
    cizimCtx.lineWidth = 5;
    cizimCtx.lineCap = "round";
    cizimCtx.beginPath();
    cizimCtx.moveTo(x, y);
    cizimCtx.lineTo(x, y - boy);
    cizimCtx.moveTo(x - 8, y - boy * 0.18);
    cizimCtx.lineTo(x - 14, y - boy * 0.6);
    cizimCtx.moveTo(x + 8, y - boy * 0.28);
    cizimCtx.lineTo(x + 15, y - boy * 0.82);
    cizimCtx.stroke();
    cizimCtx.restore();
}

function miniYosunCiz(cizimCtx, x, y, boy, renk, salinim) {
    cizimCtx.save();
    cizimCtx.strokeStyle = renk;
    cizimCtx.lineWidth = 4;
    cizimCtx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
        cizimCtx.beginPath();
        cizimCtx.moveTo(x + i * 5, y);
        cizimCtx.quadraticCurveTo(x + i * 5 + Math.sin(salinim + i) * 5, y - boy * 0.4, x + i * 5, y - boy);
        cizimCtx.stroke();
    }
    cizimCtx.restore();
}

function denizYildiziCiz(x, y, r, renk) {
    ctx.save();
    ctx.translate(x, y + 10);
    ctx.rotate(0.3);
    ctx.fillStyle = renk;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
        const xo = Math.cos(a) * r;
        const yo = Math.sin(a) * r;
        const ai = a + Math.PI / 5;
        const xi = Math.cos(ai) * (r * 0.45);
        const yi = Math.sin(ai) * (r * 0.45);
        if (i === 0) ctx.moveTo(xo, yo); else ctx.lineTo(xo, yo);
        ctx.lineTo(xi, yi);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function tasCiz(x, y, r) {
    ctx.save();
    ctx.fillStyle = "#7b8796";
    ctx.beginPath();
    ctx.ellipse(x, y + 8, r * 1.4, r, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.15, y + 4, r * 0.55, r * 0.24, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function sungerCiz(x, y, r, renk) {
    ctx.save();
    ctx.fillStyle = renk;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const w = r * (0.55 + i * 0.18);
        ctx.roundRect ? ctx.roundRect(x + i * (r * 0.45), y - r * 1.8, w, r * 1.9, r * 0.35) : yuvarlatilmisDikdortgenCiz(ctx, x + i * (r * 0.45), y - r * 1.8, w, r * 1.9, r * 0.35);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.arc(x + i * (r * 0.45) + w * 0.52, y - r * 1.15, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = renk;
    }
    ctx.restore();
}

function oyunArayuzunuCiz() {
    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(15, 14, 310, 78);

    ctx.fillStyle = "white";
    ctx.font = "15px Arial";

    const zehirDurumu = zehirBeklemeSayaci > 0 ? "Bekle: " + zehirBeklemeSayaci : "Hazır";
    ctx.fillText("Space Zehir: " + zehirDurumu, 28, 38);
    ctx.fillText("Kalkan: " + (kalkanVar ? "Aktif" : "Yok"), 28, 62);

    let aktifler = [];

    if (zehirGucluSuresi > 0) {
        aktifler.push("Güçlü Zehir");
    }

    if (yavaslatmaSuresi > 0) {
        aktifler.push("Yavaşlatma");
    }

    ctx.fillText("Aktif güç: " + (aktifler.length ? aktifler.join(", ") : "Yok"), 28, 84);

    ctx.restore();
}

function duraklatildiYazisiCiz() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(250, 190, 400, 130);

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Oyun Duraklatıldı", 335, 240);

    ctx.font = "17px Arial";
    ctx.fillText("Devam etmek için Devam Et butonuna bas.", 285, 276);
}

function oyunSonuYazisiCiz() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(175, 165, 555, 190);

    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Oyun Bitti", 390, 215);

    ctx.font = "17px Arial";
    ctx.fillText(durumYazisi.textContent, 205, 255);
    ctx.fillText("Skor: " + skor + " | Mesafe: " + Math.floor(mesafe) + " m | Seviye: " + seviye, 275, 292);
    ctx.fillText("Yeniden Başlat = tekrar balık seçimi", 305, 323);
}

function efektOlustur(x, y, renk) {
    for (let i = 0; i < 18; i++) {
        parcalar.push({
            x,
            y,
            vx: Math.random() * 5 - 2.5,
            vy: Math.random() * 5 - 2.5,
            r: Math.random() * 4 + 2,
            renk,
            omur: rastgeleSayi(25, 45)
        });
    }
}

function yaziEfektiEkle(metin, x, y, renk) {
    yaziEfektleri.push({
        metin,
        x,
        y,
        renk,
        omur: 70
    });
}

function oyunDongusu() {
    if (oyunCalisiyor && !oyunDuraklatildi) {
        oyuncuyuHareketEttir();
        yavruBaligiHareketEttir();
        kancalariHareketEttir();
        yemHareketEttir();
        zehirleriHareketEttir();
        guclendirmeKontrolEt();
        canavarKontrolEt();
        arkaPlanNesneleriniHareketEttir();
        carpismaKontrolEt();
        oyunBilgileriniGuncelle();
    } else if (!oyunDuraklatildi) {
        arkaPlanNesneleriniHareketEttir();
        zaman++;
    }

    ekraniCiz();
    animasyonId = requestAnimationFrame(oyunDongusu);
}

function muzikDurumunuDegistir() {
    if (!muzikAcik) {
        arkaMuzik.volume = 0.35;
        arkaMuzik.play();

        muzikAcik = true;
        muzikButonu.textContent = "Müziği Kapat";
    } else {
        arkaMuzik.pause();

        muzikAcik = false;
        muzikButonu.textContent = "Müziği Aç";
    }
}

function muzikBaslat() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    muzikAcik = true;
    muzikButonu.textContent = "Müziği Kapat";

    if (muzikTimer) {
        clearInterval(muzikTimer);
    }

    let notaIndex = 0;
    const melodi = [
        { frekans: 261.63, sure: 0.20 },
        { frekans: 329.63, sure: 0.20 },
        { frekans: 392.00, sure: 0.24 },
        { frekans: 523.25, sure: 0.28 },
        { frekans: 392.00, sure: 0.24 },
        { frekans: 329.63, sure: 0.22 },
        { frekans: 293.66, sure: 0.22 },
        { frekans: 349.23, sure: 0.25 }
    ];

    muzikTimer = setInterval(function() {
        const nota = melodi[notaIndex % melodi.length];
        notaCal(nota.frekans, nota.sure, 0.035, "sine");
        notaCal(nota.frekans / 2, nota.sure + 0.18, 0.018, "triangle");
        notaIndex++;
    }, 360);
}

function notaCal(frekans, sure, ses, tip) {
    if (!audioContext || !muzikAcik) {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = tip || "sine";
    oscillator.frequency.value = frekans;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(ses, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + sure);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + sure + 0.03);
}

function muzikDurdur() {
    muzikAcik = false;
    muzikButonu.textContent = "Müziği Aç";

    if (muzikTimer) {
        clearInterval(muzikTimer);
        muzikTimer = null;
    }
}

function yuvarlatilmisDikdortgenCiz(cizimCtx, x, y, w, h, r) {
    cizimCtx.beginPath();
    cizimCtx.moveTo(x + r, y);
    cizimCtx.lineTo(x + w - r, y);
    cizimCtx.quadraticCurveTo(x + w, y, x + w, y + r);
    cizimCtx.lineTo(x + w, y + h - r);
    cizimCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    cizimCtx.lineTo(x + r, y + h);
    cizimCtx.quadraticCurveTo(x, y + h, x, y + h - r);
    cizimCtx.lineTo(x, y + r);
    cizimCtx.quadraticCurveTo(x, y, x + r, y);
    cizimCtx.closePath();
}

function sinirla(deger, min, max) {
    return Math.max(min, Math.min(max, deger));
}

function rastgeleSayi(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

kabarciklariOlustur();
dekorlariOlustur();
arkaBaliklariOlustur();
kancalariOlustur();
secimEkraniniGuncelle();
ekranBilgileriniGuncelle();
oyunDongusunuBaslat();
