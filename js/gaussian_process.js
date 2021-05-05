// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// camera.position.z = 5;

// var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
// var height_disp = 2 * Math.tan( vFOV / 2 ) * camera.position.z; // visible height
// var aspect = window.innerWidth / window.innerHeight;
// var width_disp = height_disp * aspect;                  // visible width


// var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
// renderer.setClearColor(color_1_hex,1); // background color
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
// document.body.appendChild( renderer.domElement );


// const geometry = new THREE.PlaneGeometry( 5, 5, 32 );
// const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );
// scene.add( plane );

// let render = () => {
//     requestAnimationFrame( render );
//     renderer.render(scene, camera);
// };

// render();


var container;
var camera, scene, renderer;
var uniforms, material, mesh;
var mouseX = 0, mouseY = 0,
    lat = 0, lon = 0, phy = 0, theta = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
var startTime = Date.now();
animate();

function init() {
    container = document.getElementById('container');

    camera = new THREE.Camera();
    camera.position.z = 1;
    scene = new THREE.Scene();

    uniforms = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() }
    };

    material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
    uniform float time;
    uniform vec2 resolution;
    void main()	{
        gl_Position = vec4( position, 1.0 );
    }
    `,
    fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    float plot(vec2 st, float pct){
        return  smoothstep( pct-0.02, pct, st.y) -
                smoothstep( pct, pct+0.02, st.y);
    }    
    void main()	{
        vec2 st = gl_FragCoord.xy/resolution;
        // Smooth interpolation between 0.1 and 0.9
        float y = smoothstep(0.1,0.9,st.x);
    
        vec3 color = vec3(y);
    
        float pct = plot(st,y);
        color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
    
        gl_FragColor = vec4(color,1.0);        
    }
    `
    // float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;
    // float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;
    // gl_FragColor = vec4(vec3(min(x, y)), 1.);
    });

    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    container.appendChild(renderer.domElement);

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var elapsedMilliseconds = Date.now() - startTime;
    var elapsedSeconds = elapsedMilliseconds / 1000.;
    uniforms.time.value = 60. * elapsedSeconds;
    renderer.render(scene, camera);
}