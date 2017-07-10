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

// 画像を読み込む
var texture = new THREE.TextureLoader().load('img/mona-lisa.jpg',
(tex) => { // 読み込み完了時
    const w = 5;
    const h = tex.image.height/(tex.image.width/w);
    // 平面 
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial( { map:texture } );
    const plane = new THREE.Mesh( geometry, material );
    plane.scale.set(w, h, 1);
    scene.add( plane );
});

// レンダリング
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();



// ref
// http://qiita.com/kurokuma/items/0def9a7092e9ce011653
// http://qiita.com/mo49/items/3aff014a29f3adeded5b
// エラー:Failed to execute 'texImage2D' on 'WebGLRenderingContext'
// →サーバーから読んでなかったからダメだった。