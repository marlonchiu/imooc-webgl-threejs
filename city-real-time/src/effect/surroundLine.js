import * as THREE from 'three';
import { color } from '../config/index.js'

export class SurroundLine {
    constructor(scene, child) {
        this.scene = scene;
        this.child = child;

        this.createMesh();

        // 创建外围线条
        this.createLine();
    }

    computedMesh() {
        this.child.geometry.computeBoundingBox();
        this.child.geometry.computeBoundingSphere();
    }

    createMesh() {
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

    createLine() {
        // 获取建筑物的外围
        const geometry = new THREE.EdgesGeometry(this.child.geometry)

        // api创建
        // const material = new THREE.LineBasicMaterial({ color: color.soundLine })

        const {max, min} = this.child.geometry.boundingBox
        // 自定义线条渲染
        const material = new THREE.ShaderMaterial({
            uniforms: {
                line_color: {
                    value: new THREE.Color(color.soundLine)
                },
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,  1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 line_color;
                
                void main() {
                    gl_FragColor = vec4(line_color, 1.0);
                }
            `,
        })

        // 创建线条
        const line = new THREE.LineSegments(geometry, material)

        // 继承建筑物的偏移量和旋转
        line.scale.copy(this.child.scale)
        line.rotation.copy(this.child.rotation)
        line.position.copy(this.child.position)

        this.scene.add(line)
    }
}
