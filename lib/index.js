function initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) {
    // 创建顶点着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    // 创建片元着色器
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    // 关联着色器和着色器源码
    // 指定顶点着色器的源码
    gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE)
    // 指定片元着色器的源码
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE)

    // 编译着色器
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    // 创建一个程序对象
    const program = gl.createProgram()

    // 关联着色器和program
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    // 使用着色器
    gl.useProgram(program)

    return program
}