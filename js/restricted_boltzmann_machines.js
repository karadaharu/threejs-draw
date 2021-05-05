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
const addRect = (length, p_center, color) => {
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
    squareMesh.position.set(p_center[0] - length / 2 , p_center[1] + length / 2, 0.0);
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
let l = 0.85;
var beta = 0.91;

// Hopfield
var n_nodes = 9;
var n_width = 3;
var memory_nodes = [-1,-1,-1,1,1,1,-1,-1,-1];
var nodes = [-1,1,-1,1,1,1,1,-1,-1];
var weights = [];
for (var i = 0; i < n_nodes; i++) {
    weights.push([]);
    for (var j = 0; j < n_nodes; j++) {
        weights[i].push(memory_nodes[i] * memory_nodes[j]);
    }
}

for (var i = 0; i < n_nodes; i++) {
    let col = nodes[i] == 1 ? color_1_hex : color_2_hex;
    rects.push(addRect(l, [ l*(i%n_width), l*(Math.floor(i/n_width))], col));
}


var updateNodes = function() {
    var new_nodes = [];
    for (var i = 0; i < n_nodes; i++) {
        var input = 0;
        for(var j = 0; j < n_nodes; j++) {
            if (i == j) {
                continue;
            }
            input += weights[i][j] * nodes[j];
        }
        new_nodes.push(input > 0 ? 1 : -1);
        console.log(new_nodes[i]);
    }
    return new_nodes;
}

var updateDraw = function() {
    for (var i = 0; i < n_nodes; i++) {
        let col = nodes[i] == 1 ? color_1_hex : color_2_hex;
        rects[i].material.color.setHex(col);
    }
}

var randomizeNode = function() {
    var new_nodes = [];
    for (var i = 0; i < n_nodes; i++) {
        new_nodes.push(Math.random() > 0.5 ? 1 : -1);
    }
    return new_nodes;    
}

document.onkeydown = function (e) {


	var key_code = String.fromCharCode(e.keyCode);
    if (key_code == 'R') {
        nodes = randomizeNode();
    } else {
        nodes = updateNodes();
    }
    updateDraw();    
}

let render = () => {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
};

render();