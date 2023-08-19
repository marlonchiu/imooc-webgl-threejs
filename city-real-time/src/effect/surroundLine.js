import * as THREE from 'three';
import { color } from '../config/index.js'

export class SurroundLine {
    constructor(scene, child) {
        this.scene = scene;
        this.child = child;

        this.render()
    }

    computedMesh() {
        this.child.geometry.computeBoundingBox();
        this.child.geometry.computeBoundingSphere();
    }

    render() {
        this.computedMesh()
        const {max, min} = this.child.geometry.boundingBox

        // 高度差
        const size = max.z - min.z;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_city_color: {
                    // 得需要一个模型颜色 最底部显示的颜色
                    value: new THREE.Color(color.mesh)
                },
                u_head_color: {
                    // 要有一个头部颜色 最顶部显示的颜色
                    value: new THREE.Color(color.head)
                },
                u_size: {
                    value: size,
                },
            },
            vertexShader: `
                varying vec3 v_position;
            
                void main() {
                    v_position = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 v_position;
        
                uniform vec3 u_city_color;
                uniform vec3 u_head_color;
                uniform float u_size;
                
                void main() {
                    vec3 base_color = u_city_color;
                    base_color = mix(base_color, u_head_color, v_position.z / u_size);
                    
                    gl_FragColor = vec4(base_color, 1.0);
                }
            `,
        })
        
        const mesh = new THREE.Mesh(this.child.geometry, material);

        // 让mesh 继承 child 的旋转、缩放、平移
        mesh.position.copy(this.child.position)
        mesh.rotation.copy(this.child.rotation)
        mesh.scale.copy(this.child.scale)

        this.scene.add(mesh);
    }
}
