const galerieBilder = [
    "probearbeiten_assets/probearbeiten_assets/master-1904748_1280.jpg",
    "probearbeiten_assets/probearbeiten_assets/car-service-2191184_1280.jpg",
    "probearbeiten_assets/probearbeiten_assets/group2.jpeg",
    "probearbeiten_assets/probearbeiten_assets/winter-tires-2861853_1280.jpg",
    "probearbeiten_assets/probearbeiten_assets/group.jpeg",
    "probearbeiten_assets/probearbeiten_assets/car-tyres-63928_1280.jpg"
];

let aktuellesBild = 0;

const galerieImg = document.getElementById("GalerieContentImg");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

function zeigeBild(index) {
    galerieImg.src = galerieBilder[index];
}

prevBtn.addEventListener("click", () => {
    aktuellesBild = (aktuellesBild - 1 + galerieBilder.length) % galerieBilder.length;
    zeigeBild(aktuellesBild);
});

nextBtn.addEventListener("click", () => {
    aktuellesBild = (aktuellesBild + 1) % galerieBilder.length;
    zeigeBild(aktuellesBild);
});

zeigeBild(aktuellesBild);

