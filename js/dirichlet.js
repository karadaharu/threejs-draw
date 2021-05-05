var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
var height_disp = 2 * Math.tan( vFOV / 2 ) * camera.position.z; // visible height
var aspect = window.innerWidth / window.innerHeight;
var width_disp = height_disp * aspect;                  // visible width

var color_1_hex = 0x77A1D3;
var color_2_hex = 0x79CBCA;
var color_3_hex = 0xE684AE;

var color_1 = new THREE.Color(color_1_hex);
var color_2 = new THREE.Color(color_2_hex);
var color_3 = new THREE.Color(color_3_hex);

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(color_1_hex,1); // background color
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

/// Function to draw ////
var addRect = function(p_left, p_right, color_hex) {
    var squareGeometry = new THREE.Geometry(); 
    squareGeometry.vertices.push(new THREE.Vector3(p_left,  height_disp/2, 0.0)); // top left
    squareGeometry.vertices.push(new THREE.Vector3( p_right,  height_disp/2, 0.0)); // top right
    squareGeometry.vertices.push(new THREE.Vector3( p_right, -height_disp/2, 0.0)); // bottom rigtht
    squareGeometry.vertices.push(new THREE.Vector3(p_left, -height_disp/2, 0.0));  // bottom left
    squareGeometry.faces.push(new THREE.Face3(0, 1, 2)); 
    squareGeometry.faces.push(new THREE.Face3(0, 2, 3));
    var squareMaterial = new THREE.MeshBasicMaterial({ 
        color:color_hex, 
        side:THREE.DoubleSide 
    }); 
    var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial); 
    squareMesh.position.set(0, 0.0, 0.0); 
    scene.add(squareMesh);
}


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

var getColorHex = function (is_inverse=false) {
    var color = new THREE.Color();    
    var ratio = xs[0] / (xs[0]+xs[1]) - 0.5;
    var scale = 8; // 2 for normalize

    if (is_inverse) {
        var color_r = color_1;
        var color_l = color_3;
    } else {
        var color_r = color_3;
        var color_l = color_1;       
    }
    var rescale = 0;
    if (ratio < 0) {
        rescale = Math.min(-ratio*scale,1);
        color.r = color_2.r + (color_r.r - color_2.r) * rescale;
        color.g = color_2.g + (color_r.g - color_2.g) * rescale;
        color.b = color_2.b + (color_r.b - color_2.b) * rescale;
    } else {
        rescale = Math.min(ratio*scale,1);        
        color.r = color_2.r + (color_l.r - color_2.r) * rescale;
        color.g = color_2.g + (color_l.g - color_2.g) * rescale;
        color.b = color_2.b + (color_l.b - color_2.b) * rescale;
    }
    return color.getHex();
}

/// Algorithm ///
var xs;
var ks = [1.0, 0.1];
var V = 100;
var waiting_time = 0;

var timer = new THREE.Clock();
var lastTime = 0;
var scale_y = 20;
var height = 6;
var scale_time = 0.5;
var scale_x_base = width_disp/2;
var scale_x;
var points;
var has_occurred = false;

var initReaction = function (curTime) {
    xs = [100, 100];
    points = [[0-scale_x_base,xs[0]/scale_y-height]];
    waiting_time = 0;
    scale_x = scale_x_base + curTime;
}

// get waiting time for the next reaction
var getNextReaction = function() {
    var lambdas = [0, 0, 0, 0];
    lambdas[0] = ks[0] * xs[0] * xs[1] / (V*V);
    lambdas[1] = ks[0] * xs[0] * xs[1] / (V*V);
    lambdas[2] = ks[1] * xs[0] / V;
    lambdas[3] = ks[1] * xs[1] / V;

    // Gillespie's Direct method
    // Sum of the parameters in Poisson process for each reaction
    var lambda_sum = 0;
    for (var i = 0; i < lambdas.length; i++) {
        lambda_sum += lambdas[i];
    }

    // Waiting time for the next reaction
    var ran = Math.random();
    var tau = - lambda_sum * Math.log(-ran+1); // inverse transform sampling

    // Which reaction to occur
    var i_reaction = 0;
    ran = Math.random();
    var lambdas_increment = 0;
    for (var i = 0; i < lambdas.length; i++) {
        lambdas_increment += lambdas[i]/lambda_sum;
        if ( ran < lambdas_increment) {
            i_reaction = i;
            break;
        }
    }

    var reaction = {
        "tau" : tau,
        "i_reaction": i_reaction
    }

    return reaction;
}

// update the number of molcules
var reactionOccur = function(i_reaction) {
    switch(i_reaction) {
        case 0:
            if (xs[0] <= 0){
                break;
            }
            xs[0] -= 1;
            xs[1] += 1;
            break;
        case 1:
            if (xs[1] <= 0){
                break;
            }
            xs[0] += 1;
            xs[1] -= 1;            
            break;
        case 2:
            if (xs[0] <= 0){
                break;
            }
            xs[0] -= 1;
            xs[1] += 1;
            break;
        case 3:
            if (xs[1] <= 0){
                break;
            }
            xs[0] += 1;
            xs[1] -= 1;          
            break;
    }
}

var curTime = timer.getElapsedTime();
initReaction(curTime);
var reaction = getNextReaction();

var render = function () {
    requestAnimationFrame( render );

    // update
    curTime = timer.getElapsedTime();
    if ( lastTime + waiting_time < curTime) {
        lastTime = curTime;
        reactionOccur(reaction.i_reaction);
        reaction = getNextReaction();       
        waiting_time = reaction.tau / 50;
        if (curTime*scale_time-scale_x > width_disp/2) {
            initReaction(curTime*scale_time);
        }
        has_occurred = true;
    }

    // draw
    var point = [curTime*scale_time-scale_x, xs[0]/scale_y-height];
    points.push(point);    
    addRect(points[points.length-2][0], point[0], getColorHex());    
    // if (has_occurred) {
    //     addPoint(point,{ color: getColorHex(true) });
    //     has_occurred = false;
    // }
    // addLine([points[points.length-2], point],{ color:0xE1F5C4 });    
    renderer.render(scene, camera);
};

render();