import { loadFBX } from '../utils/index.js';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { SurroundLine } from '../effect/surroundLine.js';
import { Background } from '../effect/background.js';

export class City {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.loadCity();
    }

    loadCity() {
        // 加载模型，并且渲染到画布上
        loadFBX('/src/model/beijing.fbx').then((object) => {

            object.traverse((child) => {
                if (child.isMesh) {
                    new SurroundLine(this.scene, child);
                }
            });

            this.initEffect()
        });
    }

    initEffect(){
        new Background(this.scene)
    }
    start() {
    //
    }
}
