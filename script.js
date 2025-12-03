// ------------------------- UTILIDADES -------------------------

function mod(n, m) {
    return ((n % m) + m) % m;
}

function gcd(a, b) {
    while (b) [a, b] = [b, a % b];
    return a;
}

function inversoModular(a, m) {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if (mod(a * x, m) === 1) return x;
    }
    return null;
}

// ---------------------- MANEJO DEL MENSAJE ----------------------

function obtenerNumeros(msg) {
    return msg
        .trim()
        .split(/\s+/)
        .map(n => parseInt(n))
        .filter(n => !isNaN(n));
}

function generarPares(arr) {
    if (arr.length % 2 === 1) arr.push(0); // Relleno si hay impar
    let pares = [];
    for (let i = 0; i < arr.length; i += 2) {
        pares.push([arr[i], arr[i + 1]]);
    }
    return pares;
}

// ---------------------- ENCRIPTAR ----------------------

function encriptar() {
    let msg = document.getElementById("mensaje").value;
    let numeros = obtenerNumeros(msg);

    if (numeros.length === 0) {
        alert("Escribe números separados por espacios (por ejemplo: 2 3 5 7)");
        return;
    }

    // Módulo = máximo valor encontrado + 1
    let M = Math.max(...numeros) + 1;

    let a = parseInt(document.getElementById("k11").value);
    let b = parseInt(document.getElementById("k12").value);
    let c = parseInt(document.getElementById("k21").value);
    let d = parseInt(document.getElementById("k22").value);

    let det = a * d - b * c;
    if (gcd(det, M) !== 1) {
        alert("El determinante NO es invertible mod " + M);
        return;
    }

    let pares = generarPares(numeros);
    let resultado = [];

    for (let [x, y] of pares) {
        let e1 = mod(a * x + b * y, M);
        let e2 = mod(c * x + d * y, M);
        resultado.push(e1, e2);
    }

    document.getElementById("resultado").innerText = resultado.join(" ");
}

// ---------------------- DESENCRIPTAR ----------------------

function desencriptar() {
    let msg = document.getElementById("resultado").innerText.trim();
    if (!msg) {
        alert("No hay mensaje encriptado.");
        return;
    }

    let numeros = obtenerNumeros(msg);

    let M = Math.max(...numeros) + 1;

    let a = parseInt(document.getElementById("k11").value);
    let b = parseInt(document.getElementById("k12").value);
    let c = parseInt(document.getElementById("k21").value);
    let d = parseInt(document.getElementById("k22").value);

    let det = mod(a * d - b * c, M);
    let detInv = inversoModular(det, M);

    if (detInv === null) {
        alert("La matriz clave NO es invertible en mod " + M);
        return;
    }

    // Matriz inversa
    let ai = mod(detInv * d, M);
    let bi = mod(detInv * -b, M);
    let ci = mod(detInv * -c, M);
    let di = mod(detInv * a, M);

    let pares = generarPares(numeros);
    let resultado = [];

    for (let [x, y] of pares) {
        let r1 = mod(ai * x + bi * y, M);
        let r2 = mod(ci * x + di * y, M);
        resultado.push(r1, r2);
    }

    document.getElementById("resultadoDes").innerText = resultado.join(" ");
}

// ---------------------- EVENTOS ----------------------

document.getElementById("encriptar").addEventListener("click", encriptar);
document.getElementById("desencriptar").addEventListener("click", desencriptar);
