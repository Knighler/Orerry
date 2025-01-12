import * as THREE from "../node_modules/three";
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from "../node_modules/three/examples/jsm/Addons.js";
import { gsap } from '../node_modules/gsap';
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from '../node_modules/three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import Planet from './planet.js';
import Trajectory from "./trajectory.js";
import { Noise } from '../node_modules/noisejs';


// STARS
import circle from "../assets/stars/circle.png";

// EARTH
import earthmap from "../assets/textures/earth/earthmap1k.png";
import earthlights from "../assets/textures/earth/earthlights1k.jpg";
import earthspec from "../assets/textures/earth/earthspec1k.jpg";
import earthbump from "../assets/textures/earth/earthbump1k.jpg";
import earthcloud from "../assets/textures/earth/earthcloudmap.jpg";

//MOON
import moonmap from "../assets/textures/moon/moonmap4k.jpg";
import moonbump from "../assets/textures/moon/moonbump4k.jpg";

// JUPITER
import jupitermap from "../assets/textures/jupiter/jupiter.jpg";
import jupiterNightmap from "../assets/textures/jupiter/jupiternight.jpg";

// MERCURY
import mercurymap from "../assets/textures/mercury/mercurymap.jpg";
import mercuryBumpmap from "../assets/textures/mercury/mercurybump.jpg";
import mercuryNightmap from "../assets/textures/mercury/mercurynightmap.jpg";

// VENUS
import venussmap from "../assets/textures/venus/venusmap.jpg";
import venusNightmap from "../assets/textures/venus/venusmapnight.jpg";
import venusClouds from "../assets/textures/venus/venusclouds.jpg";

// MARS
import marsmap from "../assets/textures/mars/marsmap.png";
import marsbump from "../assets/textures/mars/marsbump.jpg";
import marsclouds from "../assets/textures/mars/marsclouds.png";
import marslights from "../assets/textures/mars/marsnight.jpg";

// SATURN
import saturnmap from "../assets/textures/saturn/th_saturn.png";
import saturnbump from "../assets/textures/saturn/th_saturnbump.png";
import saturnclouds from "../assets/textures/saturn/th_saturnclouds.png";
import saturnlights from "../assets/textures/saturn/th_saturnnight.png";
import saturnrings from "../assets/textures/saturn/t00fri_gh_saturnrings.png";

// URANUS
import uranusmap from "../assets/textures/uranus/uranusmap.png";
import uranuslights from "../assets/textures/uranus/uranuslights.png";
import uranusrings from "../assets/textures/uranus/uranusrings.png";

// NEPTUNE
import neptunemap from "../assets/textures/neptune/neptunemap.jpg";
import neptunebump from "../assets/textures/neptune/neptunebump.png";
import neptuneclouds from "../assets/textures/neptune/neptuneclouds.png";
import neptunelights from "../assets/textures/neptune/neptunelights.jpg";
import neptunerings from "../assets/textures/neptune/neptunerings.png";

// SUN
import sunMap from "../assets/textures/sun/sunmap.jpg";

// SUBTITLES
import { audioData } from "./subtitles.js";

// ASTEROIDS
import NEA from "../assets/asteroids/NEA.png";
import NEC from "../assets/asteroids/NEC.png";
import PHA from "../assets/asteroids/PHA.png";
import asteroidMap from "../assets/asteroids/asteroidMap.jpg"
import asteroidBumpMap from "../assets/asteroids/asteroidBumpMap.png"
import asteroids from "../data/asteroids.json";


// Speed factor for adjusting time flow. EX: speedFactor = 1600, then it runs at 1600 seconds per second.
const planetGroupArr = [];
const moonGroupArr = [];

// FOR REFERENCE
// 1 THREE JS UNIT = 1 AU * 10 = 149597870.7 KM * 10
// SIZES ARE CALCULATED ACCORDING TO DIAMETER OF EACH BODY IN AU
// EX: SUN'S SIZE = DIAMETER / 1 AU IN KM = 1,391,000 / 149,597,870.7 = 0.0093

function getStarfield(circle, numStars = 500) {
  function randomSpherePoint() {
    const radius = Math.random() * 1 + 750;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }
  const verts = [];
  const colors = [];
  const positions = [];
  let col;
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      circle
    ),
  });
  const points = new THREE.Points(geo, mat);
  return points;
}

const loadingManager = new THREE.LoadingManager();
const song1 = document.getElementById('song1')
const musicslider = document.getElementById('musicslider');
const narrslider = document.getElementById('narrslider');
const speedslider = document.getElementById('speedslider');
const body = document.getElementsByTagName("body")[0];
song1.volume = musicslider.value;

function addFilters() {
  const div = document.createElement("div");
  div.style.display = "none";
  div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none;"><filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" /></filter><filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" /></filter><filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" /></filter></svg>';
  body.appendChild(div);
}

addFilters();

//
loadingManager.onLoad = function () {

  gsap.to("#loadingcontainer", {
    opacity: 0,
    duration: 1.5,
    onUpdate: function () {
      song1.play()
    },
    onComplete: function () {
      document.getElementById('loadingcontainer').classList.add('hidden');
      playAudio(0, 4);
    }
  });

  document.getElementById('everything').classList.remove('hidden');
};


// speed slider
let speedFactor = speedslider.value;
speedslider.addEventListener('input', function () {
  speedFactor = this.value;
});

musicslider.addEventListener('input', function () {
  song1.volume = this.value;
});

//
const audioClip = document.getElementById('audioClip');
const subtitle = document.getElementById('subtitle');

audioClip.volume = narrslider.value;
narrslider.addEventListener('input', function () {
  audioClip.volume = this.value;
});

let currentSubtitles = [];
let currentPlanetIndex = 0; // Index for selected planet
let currentClipIndex = 0; // Index for selected audio clip
let lowerFlag = false;
let audioflag = true;

function playAudio(planetIndex, clipIndex) {

  const selectedPlanet = audioData[planetIndex];
  const selectedClip = selectedPlanet.audioClips[clipIndex];

  audioClip.src = selectedClip.file;
  audioClip.currentTime = 0;
  audioClip.play();
  audioflag = true;

  currentSubtitles = selectedClip.subtitles; // Set current subtitles to the selected clip

  if (lowerFlag == false) {
    gsap.to(song1, {
      volume: song1.volume * 0.25, //
      duration: 1,
    });
    lowerFlag = true;
  }

  /* */ // hide and unhide etc etc 
  updateSubtitles();
}

function updateSubtitles() {
  const currentTime = audioClip.currentTime;
  let subtitleFound = false;

  for (const { text, start, end } of currentSubtitles) {
    if (currentTime >= start && currentTime <= end) {
      subtitle.style.display = "block";
      subtitle.innerText = text; // Show current subtitle
      subtitleFound = true;
      break; // Break out of the loop after displaying the current subtitle
    }
  }

  if (!subtitleFound) {
    subtitle.innerText = ""; // Clear subtitle if none are active
  }

  if (audioClip.ended) {

    subtitle.style.display = "none";

    gsap.to(song1, {
      volume: song1.volume * 4, //
      duration: 1,
    });

    lowerFlag = false;
    audioflag = false;

  } else {
    requestAnimationFrame(updateSubtitles); // Continue checking subtitles
  }
}


// fun fact button

document.getElementById("playfact").addEventListener("click", function () {
  if ((clickedLabel.factTracker == audioData[labels.indexOf(clickedLabel)].audioClips.length) || ((clickedLabel.factTracker == 4) && (clickedLabel == sunSprite))) {
    clickedLabel.factTracker = 1; // ranges from 1 to max amount of facts per planet
  }
  currentSubtitles = [];
  playAudio(labels.indexOf(clickedLabel), clickedLabel.factTracker);
  clickedLabel.factTracker++;
});

//

let firstSmallClicked = false; // suitable position

const earthButton = document.getElementById("backToEarth");

document.getElementById("neobutton").addEventListener("click", function () {

  gsap.to(headertitle, { opacity: 0, duration: 1 }); // fade out
  gsap.to(planetui, { opacity: 0, duration: 1 }); // fade out
  gsap.to(prevbutton, { opacity: 0, duration: 1 }); // fade out
  gsap.to(nextbutton, { opacity: 0, duration: 1 }); // fade out
  prevbutton.style.cursor = 'default';
  nextbutton.style.cursor = 'default';
  returnbutton.style.cursor = 'default';
  gsap.to(returnbutton, {
    opacity: 0, duration: 1,
    onComplete: function () {
      planetui.style.display = 'none';
      prevbutton.style.display = 'none';
      nextbutton.style.display = 'none';
      returnbutton.style.display = 'none';
      prevbutton.style.cursor = 'pointer';
      nextbutton.style.cursor = 'pointer';
      returnbutton.style.cursor = 'pointer';
    }
  }); // fade out

  earthSprite.associatedNumber = 0.005;

  gsap.to(camera.position, {
    x: targetPosition.x + earthSprite.associatedNumber,
    y: targetPosition.y, // adjustable?
    z: targetPosition.z,
    duration: 2, // adjustable duration
    onUpdate: function () {
      controls.update();
      controls2.update();
      controls2.noZoom = true;


    },
    onComplete: function () {
      controls.update();
      controls2.update();
      controls2.noZoom = true;


      planetui.style.display = '';
      document.getElementById("lm").style.display = 'none';
      document.getElementById("rm").style.display = 'none';
      document.getElementById("am").style.display = '';

      earthButton.style.opacity = 0;
      earthButton.style.display = 'block';
      gsap.to(earthButton, { opacity: 1, duration: 1 })
      gsap.to(planetui, { opacity: 1, duration: 1 });
    },
  })
});

earthButton.addEventListener("click", function () {
  gsap.to(planetui, { opacity: 0, duration: 1 }); // fade out
  gsap.to(earthButton, {
    opacity: 0, duration: 1,
    onComplete: function () {
      asteroidFocus = false;
      planetui.style.display = 'none';
      earthButton.style.display = 'none';
      planetui.style.cursor = 'pointer';
      earthButton.style.cursor = 'pointer';
    }
  }); // fade out

  planetui.style.cursor = 'default';
  earthButton.style.cursor = 'default';

  earthSprite.associatedNumber = 0.002125;

  gsap.to(camera.position, {
    x: targetPosition.x + earthSprite.associatedNumber,
    y: targetPosition.y, // adjustable?
    z: targetPosition.z,
    duration: 1, // adjustable duration
    onUpdate: function () {
      controls.update();
      controls2.update();
      controls2.noZoom = true;

    },
    onComplete: function () {
      controls.update();
      controls2.update();
      controls2.noZoom = true;

      planetui.style.display = '';
      document.getElementById("lm").style.display = '';
      document.getElementById("rm").style.display = '';
      document.getElementById("am").style.display = 'none';
      document.getElementById("secondlm").style.display = 'none';
      firstSmallClicked = false;

      gsap.to(planetui, { opacity: 1, duration: 1 });

      returnbutton.style.opacity = 0;
      returnbutton.style.display = 'block';
      gsap.to(returnbutton, { opacity: 1, duration: 1 })

      nextbutton.style.opacity = 0;
      nextbutton.style.display = 'block';
      gsap.to(nextbutton, { opacity: 1, duration: 1 });

      prevbutton.style.opacity = 0;
      prevbutton.style.display = 'block';
      gsap.to(prevbutton, { opacity: 1, duration: 1 });
    },
  })

});

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // fov
  w / h, // aspect ratio
  0.0001, // near
  2000 // far
);
camera.position.x = 5;
camera.position.y = 1;
const renderer = new THREE.WebGLRenderer({ antialias: true, });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

//  CINEMATIC CAMERA CONTROLS // dont forget animate()
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enableZoom = false;
controls.enablePan = false;

const controls2 = new TrackballControls(camera, renderer.domElement);
controls2.noRotate = true;
controls2.noPan = true;
controls2.noZoom = false;
controls2.zoomSpeed = 2.5;
controls2.minDistance = 0.5;
controls2.maxDistance = 500;


const detail = 12;
const loader = new THREE.TextureLoader(loadingManager);

////////////////////////// STARS ////////////////////////////
const stars = getStarfield(circle, 2500);
scene.add(stars);

////////////////////////// JUPITER //////////////////////////
const jupiterGeometry = [0.0093, detail];
const jupiterMaterial = { map: loader.load(jupitermap) };
const jupiterNightMat = { map: loader.load(jupiterNightmap), blending: THREE.AdditiveBlending };
const jupiterFersenel = { rimHex: 0x274566, scalar: 1.005 };
const jupiterAxisSpeed = 0.00017453293
const jupiterGroup = new Planet(-3.13, 3.13, scene, jupiterGeometry, jupiterAxisSpeed);
jupiterGroup.createShape(jupiterMaterial, jupiterNightMat, jupiterFersenel);

////////////////////////// EARTH //////////////////////////
const earthGeometry = [0.00085, detail];
const earthMaterial = { map: loader.load(earthmap), specularMap: loader.load(earthspec), bumpMap: loader.load(earthbump), bumpScale: 0.04 };
const earthNightlightsMat = { map: loader.load(earthlights), blending: THREE.AdditiveBlending };
const earthCloudsMat = {
  material: { map: loader.load(earthcloud), transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending },
  scalar: 1.003
};
const earthFersenel = { rimHex: 0x045fae, scalar: 1.005 };
const earthAxisSpeed = 0.00007272205;
const earthGroup = new Planet(-23.4, 23.4, scene, earthGeometry, earthAxisSpeed);
earthGroup.createShape(earthMaterial, earthNightlightsMat, earthFersenel, earthCloudsMat)

//////////////MOON///////////////////////
const moonGroup = new THREE.Group();
moonGroup.rotation.y = 1.54 * Math.PI / 180;
moonGroup.scale.set(1 / 400, 1 / 400, 1 / 400)
scene.add(moonGroup);

const moonGeometry = new THREE.IcosahedronGeometry(0.5, detail); // 0.0092
const moonMaterial = new THREE.MeshPhongMaterial({
  map: loader.load(moonmap),
  bumpMap: loader.load(moonbump),
  bumpScale: 0.04,
});

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonGroup.add(moonMesh);
earthGroup.add(moonGroup);

////////////////////////// MERCURY //////////////////////////
const mercuryGeometry = [0.00033, detail];
const mercuryMaterial = { map: loader.load(mercurymap), bumpMap: loader.load(mercuryBumpmap), bumpScale: 0.8 };
const mercuryNightMat = { map: loader.load(mercuryNightmap), blending: THREE.AdditiveBlending };
const mercuryFersenel = { rimHex: 0x5a5957, scalar: 1.005 };
const mercuryAxisSpeed = 0.00000125383;
const mercuryGroup = new Planet(-0.01, 0.01, scene, mercuryGeometry, mercuryAxisSpeed);
mercuryGroup.createShape(mercuryMaterial, mercuryNightMat, mercuryFersenel)

////////////////////////// VENUS //////////////////////////
const venusGeometry = [0.00081, detail];
const venusMaterial = { map: loader.load(venussmap) };
const venusNightlightsMat = { map: loader.load(venusNightmap), blending: THREE.AdditiveBlending };
const venusCloudsMat = {
  material: { map: loader.load(venusClouds), blending: THREE.AdditiveBlending },
  scalar: 1.005
};
const venusFersenel = { rimHex: 0x573110, scalar: 1.005 };
const venusAxisSpeed = 0.00000029927
const venusGroup = new Planet(-177.4, 177.4, scene, venusGeometry, venusAxisSpeed);
venusGroup.createShape(venusMaterial, venusNightlightsMat, venusFersenel, venusCloudsMat)

////////////////////////// MARS //////////////////////////
const marsGeometry = [0.00045, detail];
const marsMaterial = { map: loader.load(marsmap), bumpMap: loader.load(marsbump), bumpScale: 2.5 };
const marsNightlightsMat = { map: loader.load(marslights), blending: THREE.AdditiveBlending };
const marsCloudsMat = {
  material: { map: loader.load(marsclouds), blending: THREE.AdditiveBlending },
  scalar: 1.003
};
const marsFersenel = { rimHex: 0x50342d, scalar: 1.005 };
const marsAxisSpeed = 0.00007123793
const marsGroup = new Planet(-25.19, 25.19, scene, marsGeometry, marsAxisSpeed);
marsGroup.createShape(marsMaterial, marsNightlightsMat, marsFersenel, marsCloudsMat)
marsGroup.position.set(6, 0, 0);

////////////////////////// SATURN //////////////////////////
const saturnGeometry = [1, detail];
const saturnMaterial = { map: loader.load(saturnmap), bumpMap: loader.load(saturnbump), bumpScale: 3 };
const saturnNightlightsMat = { map: loader.load(saturnlights), blending: THREE.AdditiveBlending };
const saturnCloudsMat = {
  material: { map: loader.load(saturnclouds), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending },
  scalar: 1.01
};
const saturnFersenel = { rimHex: 0x7c7c7c, scalar: 1.011 }
const saturnRing = {
  geometry: [1, 2.5, 64],
  material: { map: loader.load(saturnrings), color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 },
  scale: [0.0078, 0.0078, 0.0078],
  rotation: { x: -Math.PI / 2.25, y: null }
}
const saturnAxisSpeed = 0.00016622183
const saturnGroup = new Planet(-26.73, 26.73, scene, saturnGeometry, saturnAxisSpeed);
saturnGroup.createShape(saturnMaterial, saturnNightlightsMat, saturnFersenel, saturnCloudsMat, saturnRing)

////////////////////////// URANUS //////////////////////////
const uranusGeometry = [1, detail];
const uranusMaterial = { map: loader.load(uranusmap) };
const uranusNightlightsMat = { map: loader.load(uranuslights), blending: THREE.AdditiveBlending };
const uranusFersenel = { rimHex: 0x0089a6, scalar: 1.005 }
const uranusRing = {
  geometry: [1, 2.5, 64],
  material: { map: loader.load(uranusrings), color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 },
  scale: [0.0034, 0.0034, 0.0034],
  rotation: { x: null, y: Math.PI / 2 }
}
const uranusAxisSpeed = 0.00016622183
const uranusGroup = new Planet(-97.77, 97.77, scene, uranusGeometry, uranusAxisSpeed);
uranusGroup.createShape(uranusMaterial, uranusNightlightsMat, uranusFersenel, {}, uranusRing)

////////////////////////// NEPTUNE //////////////////////////
const neptuneGeometry = [1, detail];
const neptuneMaterial = { map: loader.load(neptunemap), bumpMap: loader.load(neptunebump), bumpScale: 1.5 };
const neptuneNightlightsMat = { map: loader.load(neptunelights), blending: THREE.AdditiveBlending };
const neptuneCloudsMat = {
  material: { map: loader.load(neptuneclouds), transparent: true, opacity: 1, blending: THREE.AdditiveBlending },
  scalar: 1.01
};
const neptuneFersenel = { rimHex: 0x628bdb, scalar: 1.005 }
const neptuneRing = {
  geometry: [1, 2.5, 64],
  material: { map: loader.load(neptunerings), color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 },
  scale: [0.0033, 0.0033, 0.0033],
  rotation: { x: null, y: null }
}
const neptuneAxisSpeed = 0.00010908308;
const neptuneGroup = new Planet(-28.32, 28.32, scene, neptuneGeometry, neptuneAxisSpeed);
neptuneGroup.createShape(neptuneMaterial, neptuneNightlightsMat, neptuneFersenel, neptuneCloudsMat, neptuneRing)


///////////////////////////// EROS ///////////////////////////
const ErosGroup = new THREE.Group(); // Create a group for the asteroid

const gltfLoaderEros = new GLTFLoader();
gltfLoaderEros.load(new URL('../assets/asteroids/eros.glb', import.meta.url).href, (gltf) => {
  const eros = gltf.scene;
  eros.rotation.x = -0.5 * Math.PI;
  eros.rotation.y = 1 * Math.PI;
  eros.rotation.z = 0.1 * Math.PI;
  ErosGroup.add(eros);
}, undefined, (error) => {
  console.error("Error loading model:", error);
});

ErosGroup.scale.set(1 / 82738, 1 / 82738, 1 / 82738);

///////////////////////////Asteroid Belt/////////////////////


const bigContainer = document.getElementById('am');
const asteroidData = asteroids.data.map(obj => {
  let type = 5; // default type if PHA and NEO are both 'N'

  if (obj.PHA === "Y") {
    type = 4; // PHA is 'Y'
  } else if (obj.NEO === "Y" && obj.PHA === "N") {
    if (obj.a > 1) {
      if (obj.q > 1.017 && obj.q < 1.3) {
        type = 0;
      } else if (obj.q < 1.017) {
        type = 1;
      }
    } else {
      if (obj.q > 0.983) {
        type = 2;
      } else {
        type = 3;
      }
    }
  }

  return { ...obj, type }; // add type to obj
});
const types = [
  { image: NEA, barColor: '#28a745', description: "Near-Earth Asteroid Amor" }, // Type 0 - NEA Amor - Green
  { image: NEA, barColor: '#f1c40f', description: "Near-Earth Asteroid Apollo" }, // Type 1 - NEA Apollo - Yellow
  { image: NEA, barColor: '#e67e22', description: "Near-Earth Asteroid Aten" }, // Type 2 - NEA Aten - Orange
  { image: NEA, barColor: '#8e44ad', description: "Near-Earth Asteroid Atira" }, // Type 3 - NEA Atira - Purple
  { image: PHA, barColor: '#e74c3c', description: "Potentially Hazardous Asteroid" }, // Type 4 - PHA - Red
  { image: NEC, barColor: '#3498db', description: "Near-Earth Comet" }  // Type 5 - NEC - Blue
];

function generateAsteroidGeometry(size, noiseScale = 0.5, noiseStrength = 0.5, scrapeCount = 50, scrapeStrength = 0.1) {
  const asteroidGeometry = new THREE.IcosahedronGeometry(size, 4);
  const positions = asteroidGeometry.attributes.position.array;
  
  const noise = new Noise(Math.random()); 

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    const noiseVal = noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseStrength;
    
    positions[i] += noiseVal;
    positions[i + 1] += noiseVal;
    positions[i + 2] += noiseVal;
  }

  const scrapeIndices = [];
  for (let i = 0; i < scrapeCount; i++) {
    const index = Math.floor(Math.random() * positions.length / 3) * 3;
    scrapeIndices.push(index);
    // Apply a smaller, subtler scrape effect
    positions[index] += (Math.random() - 0.5) * scrapeStrength;
    positions[index + 1] += (Math.random() - 0.5) * scrapeStrength;
    positions[index + 2] += (Math.random() - 0.5) * scrapeStrength;
  }

  asteroidGeometry.computeVertexNormals();

  return asteroidGeometry;
}

// asteroid geometry and material
const asteroidGeometry1 = new THREE.IcosahedronGeometry(5, 1);
const asteroidGeometry2 = generateAsteroidGeometry(5)
const asteroidMaterial = new THREE.MeshStandardMaterial({ map: loader.load(asteroidMap), bumpMap: loader.load(asteroidBumpMap), bumpScale: 100 });

let scaleFlag = false;
let OFFSETVARIABLE = 0.05 * 2.5;

// create the asteroid belt
function createAsteroidBelt() {
  var asteroidBelt = [];
  var asteroidBeltDataList = [];
  var colors = [0xF6C8A4,0xF8F5F3,0xFFFFFF,0x28A745,0xF1C40F,0xE67E22,0x8E44AD,0xE74C3C,0x3498DB];
  var choice = 1;
  var geometry = asteroidGeometry1

  for (let i = 0; i < asteroidData.length; i++) {
    const trajectory = new Trajectory(asteroidData[i].title, asteroidData[i].a, asteroidData[i].i, asteroidData[i].e, asteroidData[i].aN, asteroidData[i].peri, asteroidData[i].M, asteroidData[i].period * 365.256,false);
    let asteroidMesh = new THREE.Mesh(geometry, asteroidMaterial);
    if (i==0) {
      asteroidMesh = ErosGroup;
      OFFSETVARIABLE = 0.05 * 2.75;
    }
    if (choice === 1) {
      geometry = asteroidGeometry2;
      OFFSETVARIABLE = 10000000 ;
      choice = 2;
      scaleFlag = true;
    }else{
      geometry = asteroidGeometry1;
      OFFSETVARIABLE = 0.05 * 2.5;
      choice = 1;
    }

    asteroidMesh.userData.trajectory = trajectory;

    if(scaleFlag == true){
    asteroidMesh.scale.set(0.01,0.01,0.01);
    scaleFlag == false;
    }

    scene.add(asteroidMesh);
    asteroidBelt.push(asteroidMesh);
    const asteroid = {name: asteroidData[i].title,elements: trajectory,color: colors[i%3]};
    asteroidBeltDataList.push(asteroid);
  }
  return [asteroidBelt,asteroidBeltDataList];
}

// update asteroid belt positions
function updateAsteroidBelt(timeIncrement, asteroidBelt) {
  asteroidBelt.forEach((asteroid) => {
    const trajectory = asteroid.userData.trajectory;
    const position = updatePosition(trajectory, timeIncrement);    
    asteroid.position.set(-position[0], position[1], position[2]);
  });
}

let asteroidBelt = createAsteroidBelt();
let asteroidBeltDataList = asteroidBelt[1];
asteroidBelt = asteroidBelt[0];


function createSmalls() {
  asteroidData.forEach(small => {
    const smallElement = document.createElement('div');
    smallElement.className = 'small';

    const typeInfo = types[small.type];

    smallElement.innerHTML = `
          <img src="${typeInfo.image}" />
          <div class="smallinfo">
              <h3>${small.title}</h3>
              <p>${typeInfo.description}</p>
          </div>
      `;

    smallElement.style.setProperty('--bar-color', typeInfo.barColor);

    bigContainer.appendChild(smallElement);
  });
}
createSmalls();

let asteroidFocus = false;
let astSound1 = false;
let astSound2 = false;
let ASTtargetPosition = new THREE.Vector3();
// OFFSETVARIABLE FOR DEFAULT ASTEROID = 0.05 * 2.5
// OFFSETVARIABLE FOR EROS = 1/82738 * 15

const smalls = document.querySelectorAll('.small');
smalls.forEach((small, index) => {
  small.addEventListener('click', () => {
    asteroidFocus = true;

    document.getElementById("astUItype").innerText = types[asteroidData[index].type].description;
    document.getElementById("astUIsemimajor").innerText = asteroidData[index].a + " AU";
    document.getElementById("astUIincline").innerText = asteroidData[index].i + " degrees";
    document.getElementById("astUIecc").innerText = asteroidData[index].e;
    document.getElementById("astUIma").innerText = asteroidData[index].M + " degrees";
    document.getElementById("astUIargu").innerText = asteroidData[index].peri + " degrees";
    document.getElementById("astUIperiod").innerText = asteroidData[index].period + " days";

    ASTtargetPosition = asteroidBelt[index].position.clone().add(new THREE.Vector3(0, 0, 0));
    // const OFFSETVARIABLE = asteroidData[index].a * 2.5

    camera.lookAt(ASTtargetPosition.x, ASTtargetPosition.y, ASTtargetPosition.z);

    if (!firstSmallClicked) {
      firstSmallClicked = true;
      document.getElementById('secondlm').style.display = '';
      document.getElementById('secondlm').style.opacity = 0;
      gsap.to(document.getElementById('secondlm'), { opacity: 1, duration: 1 });
      if (astSound1 == false) {
        playAudio(10, 0);
        astSound1 = true;
      }
      // camera transition to first asteroid
      gsap.to(camera.position, {
        x: ASTtargetPosition.x + OFFSETVARIABLE,
        y: ASTtargetPosition.y, // adjustable?
        z: ASTtargetPosition.z,
        duration: 2, // adjustable duration
        onUpdate: function () {
          controls.update();
          controls2.update();
          controls2.noZoom = true;
        }
      });

      gsap.to(controls.target, {
        x: ASTtargetPosition.x,
        y: ASTtargetPosition.y,
        z: ASTtargetPosition.z,
        duration: 1.5,
        onUpdate: function () {
          controls.update();
          controls2.update();
        }
      });
    }
    else {
      // camera transition from asteroid to asteroid
      if (astSound2 == false) {
        playAudio(10, 1);
        astSound2 = true;
      }
      camera.position.set(ASTtargetPosition.x + OFFSETVARIABLE, ASTtargetPosition.y, ASTtargetPosition.z);
      controls.target.set(ASTtargetPosition.x + OFFSETVARIABLE, ASTtargetPosition.y, ASTtargetPosition.z)
    }
  });
});

function filterAndSearchItems() {
  const input = document.getElementById('search').value.toLowerCase();
  const selectedValue = document.getElementById('astType').value;
  const items = document.getElementsByClassName('small');

  for (let i = 0; i < items.length; i++) {
    const smallDataItem = asteroidData[i];
    const itemType = smallDataItem.type;

    const h3Text = items[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
    const pText = items[i].getElementsByTagName('p')[0].innerText.toLowerCase();

    // SEARCH LOGIC
    const matchesSearch = h3Text.includes(input) || pText.includes(input);

    // DROPDOWN LOGIC
    const matchesFilter = (
      selectedValue === '' ||
      (selectedValue === 'NEA' && itemType < 4) || // Types 0-3 are NEA
      (selectedValue === 'PHA' && itemType === 4) || // Type 4 is PHA
      (selectedValue === 'NEC' && itemType === 5)    // Type 5 is NEC
    );

    // COMBINE!
    if (matchesSearch && matchesFilter) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
}

document.getElementById('search').addEventListener('keyup', filterAndSearchItems);
document.getElementById('astType').addEventListener('change', filterAndSearchItems);


///////////////////////////// SUN ///////////////////////////
const sunGeometry = [0.093, detail];
const sunMaterial = { map: loader.load(sunMap) };
const lightDetails = [0xffffff, 2.5, 500, 0, 0, 0];
const sunAxisSpeed = 0.00000269341
const sunGroup = new Planet(-7.25, 7.25, scene, sunGeometry, sunAxisSpeed);
sunGroup.shape = sunGroup.addMesh(sunMaterial)
sunGroup.light = sunGroup.addLight(lightDetails)
sunGroup.position.set(0, 0, 0);

// Arrays
planetGroupArr.push(mercuryGroup);  // Mercury
planetGroupArr.push(venusGroup);    // Venus
planetGroupArr.push(earthGroup);    // Earth
planetGroupArr.push(marsGroup);     // Mars
planetGroupArr.push(jupiterGroup);  // Jupiter
planetGroupArr.push(saturnGroup);   // Saturn
planetGroupArr.push(uranusGroup);   // Uranus
planetGroupArr.push(neptuneGroup);  // Neptune
moonGroupArr.push(moonGroup);       // Moon


/////////////////////////////////////// BLOOM ////////////////////////////////////// 

const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = {};

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.36, 0.27);

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const mixPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    defines: {}
  }), 'baseTexture'
);
mixPass.needsSwap = true;

const outputPass = new OutputPass();

const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(mixPass);
finalComposer.addPass(outputPass);

sunGroup.shape.layers.enable(BLOOM_SCENE);


////////////// REAL-TIME SIMULATOR AND ORBIT /////////////////////////


const orbits = [];
const asteroidorbits = [];

// Julian date calculation
let currentJulianDate = getJulianDate();
function getJulianDate() {
  const now = new Date();
  return now.getTime() / 86400000.0 + 2440587.5;
}


const planetDataList = [
  {
    name: 'Mercury',
    elements: new Trajectory('Mercury', 0.387, 7.004, 0.2056, 48.33, 77.46, 174.796, 87.969),
    color: 0xF6C8A4
  },
  {
    name: 'Venus',
    elements: new Trajectory('Venus', 0.723, 3.395, 0.0068, 76.68069, 131.53298, 50.115, 224.701),
    color: 0xA2C2E2
  },
  {
    name: 'Earth',
    elements: new Trajectory('Earth', 1, 0, 0.01671022, -11.26064, 102.94719, 100.46435, 362.256),
    color: 0xA3D9A5
  },
  {
    name: 'Mars',
    elements: new Trajectory('Mars', 1.524, 1.848, 0.0935, 49.57854, 336.04084, 19.412, 686.980),
    color: 0xF5A9B8
  },
  {
    name: 'Jupiter',
    elements: new Trajectory('Jupiter', 5.204, 1.304, 0.0487, 100.55615, 14.75385, 20.0209, 4332.589),
    color: 0xB2E0D3
  },
  {
    name: 'Saturn',
    elements: new Trajectory('Saturn', 9.573, 2.486, 0.0520, 113.71504, 92.43194, 317.0205, 10759.22),
    color: 0xF5EAB3
  },
  {
    name: 'Uranus',
    elements: new Trajectory('Uranus', 19.165, 0.770, 0.0469, 74.22988, 170.96424, 142.5903, 30685.4),
    color: 0xD6A6E2
  },
  {
    name: 'Neptune',
    elements: new Trajectory('Neptune', 30.181, 1.770, 0.0097, 131.72, 44.97, 304.8801, 60189),
    color: 0xF6B2A4
  }
];

const moonDataList = [
  {
    name: 'Moon',
    elements: new Trajectory('Moon', 384400 / 149597870.7, 5.145, 0.0549, 125.08, 318.15, 115.3654, 27.32),
    color: 0xF6B2A4

  }
]



traceOrbits(planetDataList,orbits);
traceOrbits(asteroidBeltDataList,asteroidorbits,0.05);


function updatePosition(trajectory, timeIncrement) {
  trajectory.time += timeIncrement;
  const meanAnomaly = trajectory.epochMeanAnomaly + (2 * Math.PI / (trajectory.period * 365.25)) * trajectory.time;

  // Calculate the eccentric anomaly and true anomaly
  const eccAnomaly = meanToEccentricAnomaly(trajectory.oE, meanAnomaly);
  const trueAnomaly = eccentricToTrueAnomaly(trajectory.oE, eccAnomaly);

  // Get the planet's position based on the true anomaly
  const position = trajectory.propagate(trueAnomaly);
  return position;
}

// Function to calculate eccentric anomaly from mean anomaly
function meanToEccentricAnomaly(e, M) {
  let E = M;
  let deltaE;
  do {
    deltaE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
    E += deltaE;
  } while (Math.abs(deltaE) > 1e-6);
  return E;
}

// Function to calculate true anomaly from eccentric anomaly
function eccentricToTrueAnomaly(e, E) {
  return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
}

// Function to trace the orbits
function traceOrbits(DataList,orbits,opacity=0.1) {
  for (const obj of DataList) {
    const points = [];
    let anomaly = 0;

    // Loop to generate points for the entire orbit
    while (anomaly <= 2 * Math.PI) {
      const orbPos = obj.elements.propagate(anomaly);
      points.push(new THREE.Vector3(-orbPos[0], orbPos[1], orbPos[2]));
      anomaly += Math.PI / 180; // Increment anomaly by 1 degree in radians
    }

    // Create orbit geometry from the points
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: obj.color, transparent: true, opacity: opacity });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
    orbits.push(orbitLine);
  }
}

////////////////////////////////////// LABELS
const labels = [];

const labelColor = { r: 255, g: 255, b: 255, a: 1 }; // WHITE

// associatedNumber = 2.5 * size 
// 4 for saturn and uranus and neptune


var sunSprite = createPlanetLabel("SUN", 72, labelColor);
sunSprite.name = "SUN";
scene.add(sunSprite);
sunSprite.associatedGroup = sunGroup;
sunSprite.associatedNumber = 0.2325;
sunGroup.description = "A massive, glowing sphere of hot plasma at the center of the solar system. It generates energy through nuclear fusion, producing light and heat that sustains life on Earth. Its gravity holds the planets in orbit. The Sun is so vast that it accounts for about 99.8% of the total mass of the solar system.";
sunGroup.mass = "1,988,400";
sunGroup.radius = "695,700 km";
sunGroup.orbitalPeriod = "230 million years";
sunGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html";
sunSprite.position.y += 0.15;

var mercurySprite = createPlanetLabel("MERCURY", 72, labelColor);
mercurySprite.name = "MERCURY";
scene.add(mercurySprite);
mercurySprite.associatedGroup = mercuryGroup;
mercurySprite.associatedNumber = 0.000825;
mercuryGroup.description = "The closest planet to the Sun, Mercury has a rocky surface with extreme temperature variations between day and night. It lacks an atmosphere substantial enough to retain heat, and its surface is heavily cratered, resembling Earth's Moon. Despite its small size, Mercury has a significant gravitational pull that affects nearby celestial bodies.";
mercuryGroup.mass = "0.33010";
mercuryGroup.radius = "2439.7	km";
mercuryGroup.orbitalPeriod = "88 days";
mercuryGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html";

var venusSprite = createPlanetLabel("VENUS", 72, labelColor);
venusSprite.name = "VENUS";
scene.add(venusSprite);
venusSprite.associatedGroup = venusGroup;
venusSprite.associatedNumber = 0.002025;
venusGroup.description = "Often called Earth's twin due to its similar size and composition, Venus has a thick, toxic atmosphere primarily composed of carbon dioxide, with clouds of sulfuric acid. It experiences a runaway greenhouse effect, making it the hottest planet in the solar system. Venus also rotates in the opposite direction of most planets, meaning the Sun rises in the west and sets in the east.";
venusGroup.mass = "4.8673";
venusGroup.radius = "6051.8 km";
venusGroup.orbitalPeriod = "225 days";
venusGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html";

var earthSprite = createPlanetLabel("EARTH", 72, labelColor);
earthSprite.name = "EARTH";
scene.add(earthSprite);
earthSprite.associatedGroup = earthGroup;
earthSprite.associatedNumber = 0.002125;
earthGroup.description = "The only planet known to support life, Earth has a balanced atmosphere of nitrogen, oxygen, and other gases. It has vast oceans, diverse ecosystems, and a dynamic climate, with active geological processes such as plate tectonics. Earth's magnetic field, generated by its core, helps protect the planet from harmful solar radiation.";
earthGroup.mass = "5.9722";
earthGroup.radius = "6371 km";
earthGroup.orbitalPeriod = "365 days";
earthGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html";

var marsSprite = createPlanetLabel("MARS", 72, labelColor);
marsSprite.name = "MARS";
scene.add(marsSprite);
marsSprite.associatedGroup = marsGroup;
marsSprite.associatedNumber = 0.001125;
marsGroup.description = "Known as the Red Planet due to its iron oxide-rich surface, Mars has a thin atmosphere and polar ice caps. Its surface features include the largest volcano and one of the longest canyon systems in the solar system. Scientists believe that Mars once had liquid water on its surface, raising the possibility of ancient life.";
marsGroup.mass = "0.64169";
marsGroup.radius = "3389.5 km";
marsGroup.orbitalPeriod = "687 days";
marsGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html";

var jupiterSprite = createPlanetLabel("JUPITER", 72, labelColor);
jupiterSprite.name = "JUPITER";
scene.add(jupiterSprite);
jupiterSprite.associatedGroup = jupiterGroup;
jupiterSprite.associatedNumber = 0.02325;
jupiterGroup.description = "The largest planet, Jupiter is a gas giant primarily composed of hydrogen and helium. It has a thick atmosphere with colorful cloud bands and storms, including the Great Red Spot, a massive, long-lasting storm. It also has a strong magnetic field. Jupiter’s 95 known moons include Ganymede, the largest moon in the solar system.";
jupiterGroup.mass = "1,898.13";
jupiterGroup.radius = "69,911 km";
jupiterGroup.orbitalPeriod = "4,333 days";
jupiterGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html";

var saturnSprite = createPlanetLabel("SATURN", 72, labelColor);
saturnSprite.name = "SATURN";
scene.add(saturnSprite);
saturnSprite.associatedGroup = saturnGroup;
saturnSprite.associatedNumber = 0.0312;
saturnGroup.description = "Famous for its extensive and bright ring system, Saturn is another gas giant composed largely of hydrogen and helium. Its rings are made up of ice, rock, and dust particles, and it has many moons, including Titan, which has a dense atmosphere. Despite its massive size, Saturn is the least dense planet, so light it could float in water.";
saturnGroup.mass = "568.32";
saturnGroup.radius = "58,232 km";
saturnGroup.orbitalPeriod = "10,759 days";
saturnGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html";

var uranusSprite = createPlanetLabel("URANUS", 72, labelColor);
uranusSprite.name = "URANUS";
scene.add(uranusSprite);
uranusSprite.associatedGroup = uranusGroup;
uranusSprite.associatedNumber = 0.0136;
uranusGroup.description = "An ice giant with a pale blue-green color due to methane in its atmosphere, Uranus has a unique rotation, with its axis tilted sideways. It has faint rings and a cold, featureless atmosphere. Uranus also experiences extreme seasonal changes, with each pole facing 42 years of continuous sunlight followed by 42 years of darkness.";
uranusGroup.mass = "86.811";
uranusGroup.radius = "25,362 km";
uranusGroup.orbitalPeriod = "30,687 days";
uranusGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html";

var neptuneSprite = createPlanetLabel("NEPTUNE", 72, labelColor);
neptuneSprite.name = "NEPTUNE";
scene.add(neptuneSprite);
neptuneSprite.associatedGroup = neptuneGroup;
neptuneSprite.associatedNumber = 0.0132;
neptuneGroup.description = "The farthest ice giant, Neptune has a deep blue color also caused by methane. Its atmosphere is more dynamic than Uranus, with strong winds and storms. Neptune's moon Triton is geologically active and orbits the planet in the opposite direction of its rotation. Neptune has the fastest winds in the solar system, reaching speeds over 1,200 miles per hour.";
neptuneGroup.mass = "102.409";
neptuneGroup.radius = "24,622 km";
neptuneGroup.orbitalPeriod = "60,190 days";
neptuneGroup.factLink = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html";


labels.forEach(object => {
  object.introplayed = false;
  object.factTracker = 1;
});

function createPlanetLabel(planetName, fontsize, color) {
  return makeTextSprite(planetName, {
    fontsize: fontsize,
    textColor: color
  });
}

function makeTextSprite(message, parameters) {
  if (parameters === undefined) parameters = {};
  var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Verdana";
  var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 30;
  var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  context.font = "Bold " + fontsize + "px " + fontface;
  var metrics = context.measureText(message);
  var textWidth = metrics.width;
  var textHeight = fontsize;

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 25;

  context.font = "Bold " + fontsize + "px " + fontface;
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, depthTest: false });
  var sprite = new THREE.Sprite(spriteMaterial);

  sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);
  labels.push(sprite);
  return sprite;
}


function updateSpriteOpacity(sprite, zoomValue, minZoom, maxZoom) {

  if (fadeOutFlag == true) {

    labels.forEach(label => {
      gsap.to(label.material, {
        opacity: 0, // fade out all labels
        duration: 3,
      });
    });
    return;

  }

  if (sprite.isHovered) {
    return; // dont update opacity if the sprite is hovered
  }



  if (sprite == sunSprite) {
    sprite.material.opacity = 0.5;
  }

  let alpha;
  if (zoomValue >= maxZoom) {
    alpha = 0.5;
  } else if (zoomValue <= minZoom) {
    alpha = 0;
  } else {
    alpha = THREE.MathUtils.mapLinear(zoomValue, maxZoom, minZoom, 0.3, 0);
  }
  sprite.material.opacity = alpha;
}

// TO FIND CURRENT ZOOM LEVEL
var originalDistance = null;
function getControlsZoom() {
  if (originalDistance === null) {
    originalDistance = controls.getDistance();
  }

  var zoom = originalDistance / controls.getDistance();
  zoom = Math.round(zoom * 1e4) / 1e4;

  return zoom;
}

// USE THIS TO GET THE ZOOM LEVEL IN YOUR CONSOLE
controls.addEventListener('change', function () {
  var zoomValue = getControlsZoom();
});

///////////////////////////////////// CURSOR CONTROLS AND RAYCASTING!!!!!!!!!!!!
let raycaster, mouse;
let hoveredObject = null;
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
window.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// REST IS IN ANIMATE FUNCTION

////////////////// SETTINGS   /////////////////////

const settingsMenu = document.getElementById("settings");
settingsMenu.classList.add('hidden'); // hide

document.getElementById("settingsbutton").addEventListener("click", function () {
  settingsMenu.classList.toggle('hidden'); // toggle the hidden class
});

document.getElementById("closebutton").addEventListener("click", function () {
  settingsMenu.classList.add('hidden'); // hide the settings menu
});

const orbitbutton = document.getElementById('orbitcheck');
const asteroidorbitbutton = document.getElementById('asteroidorbitcheck');

function updateOrbitVisibility(button,orbits) {
  if (button.checked) {
    orbits.forEach(element => {
      element.visible = true;
    });
  } else {
    orbits.forEach(element => {
      element.visible = false;
    });
  }
}

updateOrbitVisibility(orbitbutton,orbits);
orbitbutton.addEventListener('click', ()=>{updateOrbitVisibility(orbitbutton,orbits)});
updateOrbitVisibility(asteroidorbitbutton,asteroidorbits);
asteroidorbitbutton.addEventListener('click', ()=>{updateOrbitVisibility(asteroidorbitbutton,asteroidorbits)});

const subbutton = document.getElementById('subcheck');
subbutton.addEventListener('click', function () {
  if (!(subbutton.checked)) {
    document.getElementById('subtitle').style.opacity = 0;
  } else {
    document.getElementById('subtitle').style.opacity = 1;
  }
});

const colorblindmenu = document.getElementById('cb');
colorblindmenu.addEventListener('change', function () {
  applyFilter(this.value);
});

function applyFilter(filterType) {
  const body = document.body;

  // Remove any existing filter classes
  body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');

  // Apply the selected filter
  if (filterType === 'protanopia') {
    body.classList.add('protanopia');
  } else if (filterType === 'deuteranopia') {
    body.classList.add('deuteranopia');
  } else if (filterType === 'tritanopia') {
    body.classList.add('tritanopia');
  }
}


//////////////////////////////////////////////// CLICK AND ZOOM /////////////////
let isZooming = false;

window.addEventListener('click', onSpriteClick, false);

const headertitle = document.getElementById("headertext");

const returnbutton = document.getElementById('resetButton');
returnbutton.style.display = 'none';
returnbutton.addEventListener('click', resetCamera);

const planetui = document.getElementById('planetui');
planetui.style.display = 'none';

const prevbutton = document.getElementById('prevbutton');
prevbutton.style.display = 'none';

const nextbutton = document.getElementById('nextbutton');
nextbutton.style.display = 'none';

let clickedLabel = null;
let targetPlanet = null;
let targetPosition = null;
let fadeOutFlag = null;
let currentIndex = null;

function onSpriteClick(event) {

  if (!isZooming || (event.target === prevbutton) || (event.target === nextbutton)) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(labels);

    if (intersects.length > 0 || (event.target === prevbutton) || (event.target === nextbutton)) {

      if (event.target === prevbutton) {
        currentIndex = labels.indexOf(clickedLabel);
        clickedLabel = labels[currentIndex - 1];
        currentIndex -= 1;
      }

      else if (event.target === nextbutton) {
        currentIndex = labels.indexOf(clickedLabel);
        clickedLabel = labels[currentIndex + 1];
        currentIndex += 1;
      }

      else {
        clickedLabel = intersects[0].object
        currentIndex = labels.indexOf(clickedLabel);
      }

      targetPlanet = clickedLabel.associatedGroup;
      targetPosition = targetPlanet.position.clone().add(new THREE.Vector3(0, 0, 0)); // adjust zoom distance
      fadeOutFlag = true;

      if (targetPlanet === earthGroup) {
        document.getElementById("neobutton").style.display = 'block';
      }
      else {
        document.getElementById("neobutton").style.display = 'none';
      }

      document.getElementById("description-value").textContent = targetPlanet.description
      document.getElementById("mass-value").textContent = targetPlanet.mass
      document.getElementById("radius-value").textContent = targetPlanet.radius
      document.getElementById("orbital-period-value").textContent = targetPlanet.orbitalPeriod
      document.getElementById("fact-sheet-link").href = targetPlanet.factLink

      camera.lookAt(targetPlanet.position); // ensure the camera looks at the planet before animation

      if (!((event.target === prevbutton) || (event.target === nextbutton))) {


        gsap.to(camera.position, {
          x: targetPosition.x + clickedLabel.associatedNumber,
          y: targetPosition.y, // adjustable?
          z: targetPosition.z,
          duration: 2, // adjustable duration
          onUpdate: function () {
            controls.update();
            controls2.update();
            controls2.noZoom = true;
            controls.enableRotate = false;

            gsap.to(headertitle, { opacity: 0, duration: 0.5 }); // fade out
          },

          onComplete: function () {
            //
            labels.forEach(object => {
              object.visible = false; // HIDE EVERYTHING
            });

            if (clickedLabel.introplayed == false) {
              playAudio(labels.indexOf(clickedLabel), 0);
              clickedLabel.introplayed = true;
            }

            gsap.to(headertitle, { opacity: 1, duration: 1 }); // fade in

            planetui.style.opacity = 0;
            planetui.style.display = '';
            gsap.to(planetui, { opacity: 1, duration: 1 }); // fade in

            prevbutton.style.opacity = 0;
            if (!(currentIndex === 0)) {
              prevbutton.style.display = '';
              gsap.to(prevbutton, { opacity: 1, duration: 1 }); // fade in
            }

            nextbutton.style.opacity = 0;
            if (!(currentIndex === labels.length - 1)) {
              nextbutton.style.display = '';
              gsap.to(nextbutton, { opacity: 1, duration: 1 }); // fade in
            }

            returnbutton.style.opacity = 0;
            returnbutton.style.display = '';
            gsap.to(returnbutton, { opacity: 1, duration: 1 }); // fade in

            //
            isZooming = true;
            controls.enableRotate = true;
            headertitle.innerText = clickedLabel.name;
          }
        });

        gsap.to(controls.target, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 1.5,
          onUpdate: function () {
            controls.update();
            controls2.update();
          }
        });

      }

      else {

        camera.position.set(targetPosition.x + clickedLabel.associatedNumber, targetPosition.y, targetPosition.z);
        controls.target.copy(targetPosition);
        headertitle.innerText = clickedLabel.name;
        updateButtonVisibility(currentIndex);

        if (audioflag == true) {
          if (clickedLabel.introplayed == false) {
            audioClip.pause();
            playAudio(labels.indexOf(clickedLabel), 0);
            clickedLabel.introplayed = true;
          }
        }
        else {
          if (clickedLabel.introplayed == false) {
            playAudio(labels.indexOf(clickedLabel), 0);
            clickedLabel.introplayed = true;
          }
        }

      }

    }
  }
}

function updateButtonVisibility() {
  if (currentIndex === 0) {
    prevbutton.style.display = 'none';
  } else {
    prevbutton.style.display = '';
    prevbutton.style.opacity = 1;
  }

  if (currentIndex === labels.length - 1) {
    nextbutton.style.display = 'none';
  } else {
    nextbutton.style.display = '';
    nextbutton.style.opacity = 1;
  }
}

function resetCamera() {

  fadeOutFlag = false;

  isZooming = false;
  controls.maxDistance = Infinity;

  gsap.to(headertitle, { opacity: 0, duration: 1 }); // fade out

  gsap.to(planetui, { opacity: 0, duration: 1 }); // fade out

  gsap.to(prevbutton, { opacity: 0, duration: 1 }); // fade out
  prevbutton.style.cursor = 'default';

  gsap.to(nextbutton, { opacity: 0, duration: 1 }); // fade out
  nextbutton.style.cursor = 'default';

  gsap.to(returnbutton, { opacity: 0, duration: 1 }); // fade out
  returnbutton.style.cursor = 'default';

  gsap.to(camera.position, {
    x: 15,
    y: 5,  // OG CAMERA POSITION
    z: 0,
    duration: 3, // adjustable duration
    onUpdate: function () {//
      labels.forEach(object => {
        object.visible = true; // UNHIDE EVERYTHING
      });
      //
      controls.enableRotate = false;
    },
    onComplete: function () {

      planetui.style.display = 'none';
      prevbutton.style.display = 'none';
      nextbutton.style.display = 'none';
      returnbutton.style.display = 'none';

      prevbutton.style.cursor = 'pointer';
      nextbutton.style.cursor = 'pointer';
      returnbutton.style.cursor = 'pointer';

      fadeOutFlag = null;
      controls.enableRotate = true;
      controls2.noZoom = false;

      gsap.to(headertitle, { opacity: 1, duration: 1 }); // fade in
      headertitle.innerText = "THE SOLAR SYSTEM";
    }
  });

  gsap.to(controls.target, {
    x: 0,
    y: 0,
    z: 0,
    duration: 2,
    onUpdate: function () {
      controls.update();
      controls2.update();
    },
  });


}

/////////////////////////////////////////////////////////////////////////////////

const cloudSpeed = 20e-5;
let previousTime = Date.now();

function animate() {

  const currentTime = Date.now();
  const deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  const timeIncrement = (deltaTime * speedFactor) / 86400;

  // Update positions of each planet
  planetGroupArr.forEach((planetGroup, index) => {
    const planetData = planetDataList[index];
    const position = updatePosition(planetData.elements, timeIncrement);
    planetGroup.position.set(-position[0], position[1], position[2]);
    labels[index + 1].position.set(-position[0], position[1], position[2]);
  });

  // Update position of moon
  moonGroupArr.forEach((moonGroup, index) => {
    const moonData = moonDataList[index];
    const position = updatePosition(moonData.elements, timeIncrement);
    moonGroup.position.set(-position[0], position[1], position[2]);
  });
  
  updateAsteroidBelt(timeIncrement, asteroidBelt);

  if (isZooming) {

    if (asteroidFocus == false) {
      targetPosition = targetPlanet.position.clone();
      controls.maxDistance = clickedLabel.associatedNumber;
    }
    else {
      targetPosition = ASTtargetPosition.clone();
      controls.maxDistance = OFFSETVARIABLE;
    }

    controls.target.copy(targetPosition)
    controls2.target.copy(targetPosition)
    controls.update();
    controls2.update();

  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(labels);

  if (intersects.length > 0) {
    // If hovering over a new object
    const newHoveredObject = intersects[0].object;

    if ((hoveredObject !== newHoveredObject) && (fadeOutFlag == null)) {
      // Change color on hover
      if (hoveredObject) {
        // OG
        hoveredObject.isHovered = false;
      }

      // NEW
      newHoveredObject.isHovered = true;
      newHoveredObject.material.opacity = 1;
      newHoveredObject.material.transparent = true;
      document.body.style.cursor = 'pointer'; // Change cursor to pointer
      hoveredObject = newHoveredObject; // Update the hovered object
    }
  } else if (hoveredObject) {
    // OG
    hoveredObject.isHovered = false;
    document.body.style.cursor = 'default'; // Reset cursor to default
    hoveredObject = null; // Clear hovered object
  }

  requestAnimationFrame(animate);

  // for the labels to remain constant
  var scaleFactor = 2.5; // GLOBAL
  var scaleVector = new THREE.Vector3();

  var scale = scaleVector.subVectors(sunSprite.position, camera.position).length() / scaleFactor;
  sunSprite.scale.set(scale * 0.15, scale * 0.1, 1); // adjust size

  var scale = scaleVector.subVectors(mercurySprite.position, camera.position).length() / scaleFactor;
  mercurySprite.scale.set(scale * 0.25, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(venusSprite.position, camera.position).length() / scaleFactor;
  venusSprite.scale.set(scale * 0.18, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(earthSprite.position, camera.position).length() / scaleFactor;
  earthSprite.scale.set(scale * 0.175, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(marsSprite.position, camera.position).length() / scaleFactor;
  marsSprite.scale.set(scale * 0.15, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(jupiterSprite.position, camera.position).length() / scaleFactor;
  jupiterSprite.scale.set(scale * 0.225, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(saturnSprite.position, camera.position).length() / scaleFactor;
  saturnSprite.scale.set(scale * 0.225, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(uranusSprite.position, camera.position).length() / scaleFactor;
  uranusSprite.scale.set(scale * 0.225, scale * 0.1, 1); // adjust size

  scale = scaleVector.subVectors(neptuneSprite.position, camera.position).length() / scaleFactor;
  neptuneSprite.scale.set(scale * 0.225, scale * 0.1, 1); // adjust size


  // LABEL FADE IN AND OUT
  var zoomValue = getControlsZoom();

  // add 0, find median
  updateSpriteOpacity(mercurySprite, zoomValue, 0.05, 0.5);
  updateSpriteOpacity(venusSprite, zoomValue, 0.005, 0.275);
  updateSpriteOpacity(earthSprite, zoomValue, 0.0005, 0.139);
  updateSpriteOpacity(marsSprite, zoomValue, 0.00005, 0.072);
  updateSpriteOpacity(jupiterSprite, zoomValue, 0.000005, 0.036);
  updateSpriteOpacity(saturnSprite, zoomValue, 0.0000005, 0.018);
  updateSpriteOpacity(uranusSprite, zoomValue, 0.0000005, 0.009);
  updateSpriteOpacity(neptuneSprite, zoomValue, 0.0000005, 0.0045);
  updateSpriteOpacity(sunSprite, zoomValue, 0, 0);


  //cinematic camera controls
  const target = controls.target;
  controls.update();
  controls2.target.set(target.x, target.y, target.z);
  controls2.update();


  // rotation around itself
  stars.rotation.y -= 0.0001;
  earthGroup.rotateAroundAxis(speedFactor)
  jupiterGroup.rotateAroundAxis(speedFactor)
  mercuryGroup.rotateAroundAxis(speedFactor);
  venusGroup.rotateAroundAxis(speedFactor, "-");
  marsGroup.rotateAroundAxis(speedFactor);
  saturnGroup.rotateAroundAxis(speedFactor);
  uranusGroup.rotateAroundAxis(speedFactor, "-");
  neptuneGroup.rotateAroundAxis(speedFactor);
  sunGroup.rotateAroundAxis(speedFactor);
  moonGroup.rotation.y += 0.0000026617 * speedFactor;


  scene.traverse(darkenNonBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
  // render the entire scene, then render bloom scene on top
  finalComposer.render();


  //renderer.render(scene, camera);
}

function darkenNonBloomed(obj) {

  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {

    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;

  }

}

function restoreMaterial(obj) {

  if (materials[obj.uuid]) {

    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];

  }

}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  finalComposer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);