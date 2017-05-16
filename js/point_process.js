var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var color_1_hex = 0x649173;
var color_2_hex = 0xDBD5A4;
var color_1 = new THREE.Color(color_1_hex);
var color_2 = new THREE.Color(color_2_hex);

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(color_1_hex,1); // background color
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

var points = [];
var addPoint = function (point, color = { color: color_2_hex }) {
    var geometry = new THREE.CircleGeometry( 0.03, 12 );
    var material = new THREE.MeshBasicMaterial( color );

    var circle = new THREE.Mesh( geometry, material );
    scene.add(circle);
    circle.position.set(point[0], point[1], 0);
}


var lines = [];
var addLine = function (points, color = { color : color_2_hex }) {
    var material = new THREE.LineBasicMaterial( color );
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
    new THREE.Vector3( points[0][0], points[0][1], 0 ),
    new THREE.Vector3( points[1][0], points[1][1], 0 )
    );

    var line = new THREE.Line( geometry, material );
    lines.push(points);
    scene.add(line);
}

camera.position.z = 5;

var xs = [100, 0, 100];
var k = 1.5;
var V = 500;
var waiting_time = 0;


// get waiting time for the next reaction
var getWaitingTime = function() {
    var lambda = k * xs[0] * xs[2] / (V*V);
    var ran = Math.random();
    var tau = - lambda * Math.log(-ran+1); // inverse transform sampling
    return tau;
}

// update the number of molcules
var reactionOccur = function() {
    xs[0] = xs[0] - 1;
    xs[1] = xs[1] + 1;
}

var timer = new THREE.Clock();
var lastTime = 0;


var scale_y = 10;
var height = 9;
var scale_time = 5.0;
var scale_x_base = 6;
var scale_x = scale_x_base;
var points = [[0-scale_x,xs[0]/scale_y-height]];
var has_occurred = false;

var initReaction = function (curTime) {
    xs = [100, 0, 100];    
    points = [[0-scale_x_base,xs[0]/scale_y-height]];
    waiting_time = 0;
    scale_x = scale_x_base + curTime;
}

var render = function () {
    requestAnimationFrame( render );

    // update
    var curTime = timer.getElapsedTime();
    if ( lastTime + waiting_time < curTime) {
        lastTime = curTime;
        reactionOccur();
        waiting_time = getWaitingTime();       
        if (waiting_time < 0) {
            initReaction(curTime*scale_time);
        }
        has_occurred = true;
    }

    // draw
    var point = [curTime*scale_time-scale_x, xs[0]/scale_y-height];
    if (has_occurred) {
        addPoint(point);
        has_occurred = false;
    }
    points.push(point);
    addLine([points[points.length-2], point]);

    renderer.render(scene, camera);
};

render();