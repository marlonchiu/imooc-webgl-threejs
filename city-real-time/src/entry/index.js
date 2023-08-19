import '../style/index.css';
import * as THREE from "three";

export const initCity = () => {
    // 获取canvas元素
    const canvas = document.getElementById("webgl");

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        100000
    );
    camera.position.set(0, 0, 100)
    scene.add(camera);

    // 添加灯光
    scene.add(new THREE.AmbientLight(0xadadad));
    const directionLight = new THREE.DirectionalLight(0xffffff);
    directionLight.position.set(0, 0, 0);
    scene.add(directionLight);

    // 创建一个立方体
    const box = new THREE.BoxGeometry(10, 10, 10)
    const material = new THREE.MeshLambertMaterial({color: 0xff0000})
    const mesh = new THREE.Mesh(box, material)
    scene.add(mesh)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // 设置场景颜色
    renderer.setClearColor(new THREE.Color(0x000000), 1);


    // 渲染场景
    renderer.render(scene, camera);

    window.addEventListener("resize", () => {
        // 更新宽高比
        camera.aspect = window.innerWidth / window.innerHeight;
        // 更新相机的投影矩阵
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
};