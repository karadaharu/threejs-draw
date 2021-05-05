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
camera.position.set(0, 0, 10);

// ライト
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );


WebFont.load({
    google: {
        families: ['Cabin Sketch']
    },
    active: function(fontFamily, fontDescription) {
        // ロード完了
        console.log('webfonts loaded');        
        let txtCanvas = document.createElement('canvas');
        let txtCanvasCtx = txtCanvas.getContext('2d');
        // let textureGridSize = 10;
        // txtCanvas.width = textureGridSize * 3;
        // txtCanvas.height =textureGridSize * 2;
        txtCanvasCtx.font = 'normal 80px ' + 'Cabin Sketch';
        // txtCanvasCtx.textAlign = 'center';
        txtCanvasCtx.fillStyle = '#00ffff';

        let txt = 'あいう';
        txtCanvasCtx.fillText(
            txt, 10, 80
        );

        // document.body.appendChild(txtCanvas);

        let txtTexture = new THREE.Texture(txtCanvas);
        txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
        txtTexture.needsUpdate = true;  // テクスチャを更新

        let material = new THREE.RawShaderMaterial({
            uniforms: {
                txtTexture : {type : 't'}
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        material.uniforms.txtTexture.value = txtTexture;

        let vertices = [];
        let uvs = [];
        let indices = [];

        // 左上
        vertices.push(-1);
        vertices.push(1);
        vertices.push(0);
        uvs.push(0);
        uvs.push(0);

        // 右上
        vertices.push(1);
        vertices.push(1);

        uvs.push(1);
        uvs.push(0);

        // 左下
        vertices.push(-1);
        vertices.push(-1);

        uvs.push(0);
        uvs.push(1);

        // 右下
        vertices.push(1);
        vertices.push(-1);

        uvs.push(1);
        uvs.push(1);

        indices.push(0);
        indices.push(2);
        indices.push(1);
        indices.push(2);
        indices.push(3);
        indices.push(1);

        let bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        bufferGeometry.uv = new THREE.BufferAttribute(new Float32Array(uvs), 2);
        bufferGeometry.addAttribute('inddex', new THREE.BufferAttribute(new Uint16Array(indices), 1));

        let mesh = new THREE.Mesh(bufferGeometry, material);
        scene.add(mesh);
    }
});

// レンダリング
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();



