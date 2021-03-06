// AUDIO
window.AudioContext = window.webkitAudioContext || window.AudioContext;
let context = new AudioContext();
let analyser = context.createAnalyser();
analyser.fftSize = 64;

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
// Access to Mic throgh getUserMedia
navigator.getUserMedia(
	{ video:false, audio:true },
	function(stream) {
		var mic = context.createMediaStreamSource(stream);
		mic.connect(analyser);
	},
	function(error) { return; }
);


// Scene
let scene = new THREE.Scene();

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

// Camera
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 0, 100);

// Lights
let n_light = 4;
let lights = [];
let light_colors = [[0, 0.50,0.5], [0.5, 0.5, 0.5], [1.0, 0.5 ,0.5]];
let light_poss = [[-100,-100,100], [100,100,100], [0,-100,100]];
for (let i = 0; i < n_light-1; i++) {
    let col = new THREE.Color().setHSL(light_colors[i][0],light_colors[i][1],light_colors[i][2]);
    let directionalLight = new THREE.DirectionalLight(col, 0.5);
    directionalLight.position.set(light_poss[i][0],light_poss[i][1],light_poss[i][2]);
    lights.push(directionalLight);
    scene.add(directionalLight);
}
let light = new THREE.AmbientLight(0xff0000,0.5);
lights.push(light);
scene.add( light );

// Cubes
let cubes = [];
let n_cubes = 4;
let x_interval = 30;
let size = 12;
for (i = 0; i < n_cubes; i++) {
    let geometry = new THREE.BoxGeometry(size,size,size);
    let material = new THREE.MeshPhongMaterial( { color: '#ffffff' } );
    let cube = new THREE.Mesh( geometry, material );
    cube.position.set(i*x_interval-(n_cubes/2)*x_interval+size, 0, 0);
    cubes.push(cube);
    scene.add( cube );
}

let rotations = [];
for (i = 0; i < n_cubes; i++) {
    rotations.push(new THREE.Vector3(1,0,0));
}

function updateRotation(waveData) {
    for (i = 0; i < n_cubes; i++) {
        rotations[i].add(new THREE.Vector3(waveData[0+i],waveData[4+i],waveData[8+i])).normalize();
        if (!isNaN(rotations[i].x)) {      
            cubes[i].rotateOnAxis(rotations[i],waveData[12+i]/1000);
        }
    } 
};

function updateColor(waveData){
    let scale = 30000;
    for (let i = 0; i < n_light; i++) {
        let col = lights[i].color.getHSL();
        col.h = col.h + (waveData[0+i*4] - 128) / scale;    
        col.h = col.h - Math.floor(col.h);
        col.s = col.s + (waveData[1+i*4] - 128) / scale;
        col.s = (col.s - Math.floor(col.s)) / 3.0 + 0.3;
        col.l = col.l + (waveData[2+i*4] - 128) / scale;
        col.l = (col.l - Math.floor(col.l)) / 3.0 + 0.3;
        lights[i].color.setHSL(col.h, col.s, col.l);
        if (i==n_light-1) {
            scene.background = lights[i].color;
        }
    }
}

// Update
function render() {
    requestAnimationFrame(render);

	let waveData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(waveData);
    updateRotation(waveData);
    updateColor(waveData);

    renderer.render(scene, camera);
}
render();