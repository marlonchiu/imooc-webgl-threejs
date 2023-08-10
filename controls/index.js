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
    }
}


const itemType = {
    SpotLight: ['color', 'intensity', 'distance', 'angle', 'exponent'],// 聚光灯
    AmbientLight: ['color'], // 环境光
    PointLight: ['color', 'intensity', 'distance'], // 点光源
    DirectionalLight: ['color', 'intensity'], // 平行光
}

function initControls(item) {
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
            controls[typeList[i]] = child.getValue(item)

            const childExtends = child.extends || [];

            gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
                child.setValue(item, value,);
            });
        }
    }
}
