const basicType = {
    color: {
        method: 'addColor',
        getValue: item => item.color.getStyle(),
        setValue: (item, value) => item.color.setStyle(value),
    },
    groundColor: {
        method: 'addColor',
        getValue: item => item.groundColor.getStyle(),
        setValue: (item, value) => item.groundColor.setStyle(value),
    },
    intensity: {
        extends: [0, 10],
        getValue: item => item.intensity,
        setValue: (item, value) => item.intensity = +value,
    },
    distance: {
        extends: [0, 2],
        getValue: item => item.distance,
        setValue: (item, value) => item.distance = +value,
    },
    angle: {
        extends: [0, Math.PI / 2],
        getValue: item => item.angle,
        setValue: (item, value) => item.angle = +value,
    },
    exponent: {
        extends: [0, 20],
        getValue: item => item.exponent,
        setValue: (item, value) => item.exponent = +value,
    },
    opacity: {
        extends: [0, 1], getValue: item => item.opacity,
        setValue: (item, value) => item.opacity = +value,
    },
    transparent: {
        getValue: item => item.transparent,
        setValue: (item, value) => item.transparent = value,
    },
    wireframe: {
        getValue: item => item.wireframe,
        setValue: (item, value) => item.wireframe = value,
    },
    visible: {
        getValue: item => item.visible,
        setValue: (item, value) => item.visible = value,
    },
    cameraNear: {
        extends: [0, 50],
        getValue: (item, camera) => camera.near,
        setValue: (item, value, camera) => camera.near = value,
    },
    cameraFar: {
        extends: [50, 1000],
        getValue: (item, camera) => camera.far,
        setValue: (item, value, camera) => camera.far = value,
    },
    side: {
        extends: [['front', 'back', 'double']],
        getValue: () => 'front',
        setValue: (item, value) => {
            switch (value) {
                case 'front':
                    item.side = THREE.FrontSide;
                    break;
                case 'back':
                    item.side = THREE.BackSide;
                    break;
                case 'double':
                    item.side = THREE.DoubleSide;
                    break;
            }
        },
    },
    // 材料的环境颜色
    ambient: {
        method: 'addColor',
        getValue: (item) => item.ambient.getHex(),
        setValue: (item, value, camera) => item.ambient = new THREE.Color(value),
    },
    // 物体材料本身发出的颜色
    emissive: {
        method: 'addColor',
        getValue: (item) => item.emissive.getHex(),
        setValue: (item, value, camera) => item.emissive = new THREE.Color(value),
    },
    // 设置高亮部分的颜色
    specular: {
        method: 'addColor',
        getValue: (item) => item.specular.getHex(),
        setValue: (item, value, camera) => item.specular = new THREE.Color(value),
    },
    // 设置高亮部分的亮度
    shininess: {
        extends: [0, 100],
        getValue: (item) => item.shininess,
        setValue: (item, value, camera) => item.shininess = value,
    },
    red: {
        extends: [0, 1],
        getValue: (item) => item.uniforms.r.value,
        setValue: (item, value, camera) => item.uniforms.r.value = value,
    },
    alpha: {
        extends: [0, 1],
        getValue: (item) => item.uniforms.a.value,
        setValue: (item, value, camera) => item.uniforms.a.value = value,
    },
    dashSize: {
        extends: [0, 5],
        getValue: (item) => item.dashSize,
        setValue: (item, value, camera) => item.dashSize = +value,
    },
    gapSize: {
        extends: [0, 5],
        getValue: (item) => item.gapSize,
        setValue: (item, value, camera) => item.gapSize = +value,
    },
    width: getMeshValue([0, 20], 'width'),
    height: getMeshValue([0, 20], 'height'),
    widthSegments: getMeshValue([0, 20], 'widthSegments'),
    heightSegments: getMeshValue([0, 20], 'heightSegments'),
    radius: getMeshValue([1, 20], 'radius'),
    segments: getMeshValue([3, 80], 'segments'),
    thetaStart: getMeshValue([0, Math.PI * 2], 'thetaStart'),
    thetaLength: getMeshValue([0, Math.PI * 2], 'thetaLength'),
}


function createMaterial(geometry) {
    const lambert = new THREE.MeshLambertMaterial({color: 0xff0000})
    const basic = new THREE.MeshBasicMaterial({wireframe: true})

    return THREE.SceneUtils.createMultiMaterialObject(geometry, [
        lambert,
        basic
    ])
}

const roundValue = {
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1,
}

function removeAndAdd(item, value, camera, mesh, scene, controls) {

    const {x, y, z} = mesh.pointer.rotation;

    scene.remove(mesh.pointer);
    const arg = [];

    for (const key in controls) {
        if (roundValue[key]) {
            controls[key] = ~~controls[key];
        }
        arg.push(controls[key])
    }

    mesh.pointer = createMaterial(new THREE[item.type](...arg))

    mesh.pointer.rotation.set(x, y, z);
    scene.add(mesh.pointer);
}

function getMeshValue(extend, name) {
    return {
        extends: extend,
        getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters[name],
        setValue: (...arg) => removeAndAdd(...arg),
    }
}

const itemType = {
    SpotLight: ['color', 'intensity', 'distance', 'angle', 'exponent'],// 聚光灯
    AmbientLight: ['color'], // 环境光
    PointLight: ['color', 'intensity', 'distance'], // 点光源
    DirectionalLight: ['color', 'intensity'], // 平行光
    HemisphereLight: ['skyColor', 'groundColor', 'intensity'], // 半球光
    MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible'], // 基础材质
    MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'], // 深度材质
    MeshNormalMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side'], // 法向材质
    MeshLambertMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'ambient', 'emissive', 'color'], // 郎伯材质
    MeshPhongMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'ambient', 'emissive', 'color', 'specular', 'shininess'], // Phong 材质
    ShaderMaterial: ['red', 'alpha'], // 着色器材质
    LineBasicMaterial: ['color'], // 直线和虚线 -- 直线
    LineDashedMaterial: ['color', 'dashSize', 'gapSize'], // 直线和虚线 -- 虚线
    PlaneGeometry: ['width', 'height', 'widthSegments', 'heightSegments'], // 二维平面
    PlaneBufferGeometry: ['width', 'height', 'widthSegments', 'heightSegments'], // 二维平面
    CircleGeometry: ['radius', 'segments', 'thetaStart', 'thetaLength'], // 二维圆
}

function initControls(item, camera, mesh, scene) {
    console.log(item);
    const typeList = itemType[item.type]
    const controls = {}

    if (!typeList || !typeList.length) {
        return false;
    }

    const gui = new dat.GUI();

    for (let i = 0; i < typeList.length; i++) {
        const child = basicType[typeList[i]]
        if (child) {
            console.log(child)
            controls[typeList[i]] = child.getValue(item, camera, mesh.pointer)

            const childExtends = child.extends || [];

            gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
                child.setValue(item, value, camera, mesh, scene, controls);
            });
        }
    }
}
