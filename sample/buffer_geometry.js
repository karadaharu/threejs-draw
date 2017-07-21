// シーン
var scene = new THREE.Scene();

// レンダラー
var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0xffffff,1);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// カメラ
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 0, 10);

// ライト
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

// canvas要素
var txt = '落ち着け';
var n_char = txt.length;
var char_size = 512;
var ratio = 1.1;
var canvasHeight = char_size * ratio;
var canvasWidth = char_size * n_char * ratio;

// BufferGeometryを生成
var geometry = new THREE.BufferGeometry();
// 平面用の頂点を定義
// d - c
// |   |
// a - b
var l = 2.0;
var l_w = l*n_char;
var l_h = l;
var vertexPositions = [
    [-l_w, -l_h, 1.0], // a
    [ l_w, -l_h, 1.0], // b
    [ l_w,  l_h, 1.0], // c
    [-l_w,  l_h, 1.0]  // d
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
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0 
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


var txtCanvas = document.createElement('canvas');
txtCanvas.width = canvasWidth;
txtCanvas.height = canvasHeight;
var txtCanvasCtx = txtCanvas.getContext('2d');
txtCanvasCtx.font = 'normal '+ char_size.toString()  +'px' + ' ' + 'Hiragino Mincho ProN';
txtCanvasCtx.fillStyle = '#ff00ff';
txtCanvasCtx.textAlign = 'center';
txtCanvasCtx.rect(0,0, txtCanvas.width, txtCanvas.height);
txtCanvasCtx.fill();

txtCanvasCtx.fillStyle = '#000000';
txtCanvasCtx.fillText(
    // txt, txtCanvas.width, txtCanvas.height
    txt, (canvasWidth)/2, char_size
);
var txtTexture = new THREE.Texture(txtCanvas);

// txtTexture.minFilter = THREE.LinearFilter;
txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
txtTexture.needsUpdate = true;  // テクスチャを更新

material_shader.uniforms.txtTexture.value = txtTexture;

var mesh = new THREE.Mesh(geometry, material_shader);
var mesh1 = new THREE.Mesh(geometry, material);

scene.add(mesh);

var updateText = function(txtCanvasCtx, txtOld, txtNew) {
    txtCanvasCtx.fillStyle = '#ff00ff';    
    txtCanvasCtx.fillText(
        txtOld, (canvasWidth)/2, char_size        
    );
    txtCanvasCtx.fillStyle = '#000000';    
    txtCanvasCtx.fillText(
        txtNew, (canvasWidth)/2, char_size        
    );
    txtTexture.needsUpdate = true;  // テクスチャを更新     
};


// txtCanvasCtx.fillStyle = '#ffffff';    
// txtCanvasCtx.fillText('もちつけ', (canvasWidth)/2, char_size);

// レンダリング
//
var is_update = true;
function render() {
    if (is_update) {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      is_update = false;
    //   txtCanvasCtx.fillStyle = '#ffffff';    
    // txtCanvasCtx.fillText('もちつけ', (canvasWidth)/2, char_size);
      updateText(txtCanvasCtx, '落ち着け', 'もちつけ');

    //   var txtTexture = new THREE.Texture(txtCanvas);      
    //     txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
     
    //   material_shader.uniforms.txtTexture.value = txtTexture;      
    }
}
render();