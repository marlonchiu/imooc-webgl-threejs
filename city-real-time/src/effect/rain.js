import * as THREE from 'three'
import { Points } from './points'

export class Rain {
    constructor(scene) {

        this.points = new Points(scene, {
            size: 10,
            opacity: 0.4,
            range: 1000,
            count: 800,
            setAnimation(position) {
                position.y -= position.speedY;

                if (position.y <= 0) {
                    position.y = this.range / 2;
                }
            },
            setPosition(position) {
                position.speedY = 20;
            },
            url: '../../src/assets/rain.png',
        });

        // this.scene = scene;
        //
        // // 范围
        // this.range = 1000;
        // // 雪花的个数
        // this.count = 800;
        //
        // this.pointList = [];
        //
        // this.init();
    }

    init() {
        // 粒子和粒子系统
        // PointCloud   Points

        // 材质
        this.material = new THREE.PointsMaterial({
            size: 10,
            map: new THREE.TextureLoader().load('../../src/assets/rain.png'),
            transparent: true,
            opacity: 0.4,
            depthTest: false,
        })

        // 几何对象
        this.geometry = new THREE.BufferGeometry();

        // 添加顶点信息
        for (let i = 0; i < this.count; i++) {
            const position = new THREE.Vector3(
                Math.random() * this.range - this.range / 2,
                Math.random() * this.range,
                Math.random() * this.range - this.range / 2,
            )

            position.speedY = 20;

            this.pointList.push(position)
        }
        this.geometry.setFromPoints(this.pointList);

        this.point = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.point);
    }

    animation() {
        this.points.animation();

        // this.pointList.forEach(position => {
        //     position.y -= position.speedY;
        //
        //     if (position.y <= 0) {
        //         position.y = this.range / 2;
        //     }
        //
        // })
        // this.point.geometry.setFromPoints(this.pointList);
    }
}
