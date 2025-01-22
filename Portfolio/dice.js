const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(200, 200);
renderer.shadowMap.enabled = true;
document.querySelector('.threejsContainer').appendChild(renderer.domElement);

// Szene-Hintergrund transparent machen
scene.background = null;

// Farbpalette
const colors = {
    smokyBlack: 0x0A0503,
    tigersEye: 0xA86420,
    ochre: 0xCE7103,
    bistre: 0x371D05,
    sealBrown: 0x512804
};

// Geometrie des D20 (Icosaeder)
const geometry = new THREE.IcosahedronGeometry(6.5, 0);

// Material für die Geometrie
const material = new THREE.MeshStandardMaterial({
    color: colors.tigersEye,
    roughness: 0.4,
    metalness: 0.2,
    emissive: colors.sealBrown,
    emissiveIntensity: 0.1
});

// Wireframe-Material
const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: colors.smokyBlack,
    wireframe: true
});

// Mesh erstellen und zur Szene hinzufügen
const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.castShadow = true;
icosahedron.receiveShadow = true;
scene.add(icosahedron);

// Lichter hinzufügen
const ambientLight = new THREE.AmbientLight(colors.bistre, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(colors.ochre, 1.2);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);
let animationSpeed = 0.01;

// Raycaster und Maus erstellen
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event-Listener für Mausbewegung
window.addEventListener('mousemove', (event) => {
    // Mausposition normalisieren
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycasting durchführen
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(icosahedron);

    // Material wechseln, wenn Maus über Würfel ist
    if (intersects.length > 0) {
        icosahedron.material = wireframeMaterial;
        animationSpeed = 0.025;
    } else {
        icosahedron.material = material;
        animationSpeed = 0.01;
    }
});

// Kamera Position
camera.position.z = 15;

// Animationsschleife
function animate() {
    requestAnimationFrame(animate);
    icosahedron.rotation.x += animationSpeed;
    icosahedron.rotation.y += animationSpeed;
    renderer.render(scene, camera);
}
animate();
