var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
var height_disp = 2 * Math.tan( vFOV / 2 ) * camera.position.z; // visible height
var aspect = window.innerWidth / window.innerHeight;
var width_disp = height_disp * aspect;                  // visible width

var color_1_hex = 0x085078;
var color_2_hex = 0x85D8CE;

var color_1 = new THREE.Color(color_1_hex);
var color_2 = new THREE.Color(color_2_hex);

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(color_1_hex,1); // background color
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

/// Function to draw ////
const addRect = (length, p_top_left, color) => {
    var squareGeometry = new THREE.Geometry();   
    squareGeometry.vertices.push(new THREE.Vector3(0, 0, 0.0)); // top left    
    squareGeometry.vertices.push(new THREE.Vector3(length, 0, 0.0)); // top right
    squareGeometry.vertices.push(new THREE.Vector3(length, -length, 0.0)); // bottom rigtht
    squareGeometry.vertices.push(new THREE.Vector3(0, -length, 0.0));  // bottom left
    squareGeometry.faces.push(new THREE.Face3(0, 1, 2)); 
    squareGeometry.faces.push(new THREE.Face3(0, 2, 3));
    var squareMaterial = new THREE.MeshBasicMaterial({ 
        color:color,
        side:THREE.DoubleSide 
    });
    var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial); 
    squareMesh.position.set(p_top_left[0]-w*l/2, p_top_left[1]-h*l/2, 0.0);
    scene.add(squareMesh);
    return squareMesh;
}

const updateSpin = (spins, i, j) => {
    let cur_spin = spins[i][j];
    let n_cur = countSurrounding(spins, i, j, cur_spin);
    let n_nex = 4 - n_cur;
    let e_cur = - n_cur;
    let e_nex = - n_nex;
    let e_delta = e_nex - e_cur;
    if (e_delta<0) {
        return -1 * cur_spin;
    } else if ( Math.pow(Math.E, -beta*e_delta ) > Math.random() ) {
        return -1 * cur_spin;
    }
    return cur_spin;
}

const countSurrounding = (spins, i, j, cur_spin) => {
    let left, right, top, bottom;
    if (j==0) {
        left = w-1;
        right = j+1;
    } else if (j==w-1) {
        left = j-1;
        right = 0;
    } else {
        left = j-1;
        right = j+1;
    }
    if (i==0) {
        top = h-1;
        bottom = i+1;
    } else if (i==h-1) {
        top = i-1;
        bottom = 0;
    } else {
        top = i-1;
        bottom = i+1;
    }

    let count = 0;
    if (spins[i][left]==1) count++;
    if (spins[top][j]==1) count++;
    if (spins[i][right]==1) count++;
    if (spins[bottom][j]==1) count++;
    if (cur_spin == -1) count = 4 - count;
    
    return count;
}

let rects = [];
var w = 70;
var h = 70;
let l = 0.05;
var beta = 0.91;

// init data & draw
let spins = new Array(h);
for (let i = 0; i < h; i++) {
    spins[i] = new Array(w);
}
for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
        spins[i][j] = Math.round(Math.random())*2-1;
        let col = spins[i][j] == 1 ? color_1_hex : color_2_hex;
        rects.push(addRect(l, [i*l, j*l], col));
    }
}

let render = () => {
    requestAnimationFrame( render );
    for (let n = 0; n < 1000; n++) {
        let i = Math.floor(h*Math.random());
        let j = Math.floor(w*Math.random());
        spins[i][j] = updateSpin(spins, i, j);
        let col = spins[i][j] == 1 ? color_1_hex : color_2_hex;    
        rects[i*w+j].material.color.setHex(col);    
    }

    renderer.render(scene, camera);
};

render();