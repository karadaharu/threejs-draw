// シーン
var scene = new THREE.Scene();

// レンダラー
var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0xffffff,1);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

// カメラ
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 0, 100);

// ライト
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );


// BufferGeometryを生成
var geometry = new THREE.BufferGeometry();

// 平面用の頂点を定義
// d - c
// |   |
// a - b
var vertexPositions = [
    [-0.5, -1.0, 1.0], // a
    [ 0.5, -0.5, 1.0], // b
    [ 1.0,  0.5, 1.0], // c
    [-1.0,  1.0, 1.0]  // d
];

// Typed Arrayで頂点データを保持
var vertices = new Float32Array(vertexPositions.length * 3);
for (var i = 0; i < vertexPositions.length; i++) {
    vertices[i * 3 + 0] = vertexPositions[i][0];
    vertices[i * 3 + 1] = vertexPositions[i][1];
    vertices[i * 3 + 2] = vertexPositions[i][2];
}

// 頂点インデックスを生成
var indices = new Uint16Array([
    0, 1, 2,
    2, 3, 0
]);

var uv = new Float32Array([
    // 0.0, 1.0,
    // 1.0, 1.0,
    // 1.0, 0.0,
    // 0.0, 0.0
    0.2, 0.2,
    0.1, 1.0,
    1.0, 0.5,
    0.4, 0.1    
]);

// attributesを追加
geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(new THREE.BufferAttribute(indices,  1));
geometry.addAttribute('uv', new THREE.BufferAttribute(uv,2));

// ふつうの
var material = new THREE.MeshLambertMaterial({
    color: 0xff0000
});
// シェーダー
var material_shader = new THREE.RawShaderMaterial({
    uniforms: {
        txtTexture : {type : 't'}
    },    
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});

// テクスチャを読み込む
// 画像
var texture = new THREE.TextureLoader().load('../img/mona-lisa.jpg');
// canvas要素
let txtCanvas = document.createElement('canvas');
let txtCanvasCtx = txtCanvas.getContext('2d');
txtCanvasCtx.font = 'normal 80px ' + 'Cabin Sketch';
txtCanvasCtx.fillStyle = '#00ffff';
let txt = 'あいう';
txtCanvasCtx.fillText(
    txt, 10, 80
);
let txtTexture = new THREE.Texture(txtCanvas);
txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
txtTexture.needsUpdate = true;  // テクスチャを更新

material_shader.uniforms.txtTexture.value = txtTexture;

var mesh = new THREE.Mesh(geometry, material_shader);
mesh.position.z = 10;

scene.add(mesh);

// レンダリング
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();