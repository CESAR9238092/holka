// Referencias a los elementos del DOM
const mensaje = document.getElementById('mensaje');          // Input/textarea del mensaje
const charCount = document.querySelector('.char-count');      // Contador de caracteres (x/30)
const matrizMensaje = document.getElementById('matrizMensaje'); // Div donde se muestra la matriz del mensaje

// Elementos de la matriz clave 2x2 (Hill cipher)
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');

// Botones
const btnEncriptar = document.getElementById('encriptar');
const btnDesencriptar = document.getElementById('desencriptar');

// Resultados
const resultado = document.getElementById('resultado');       // Texto encriptado
const resultadoDes = document.getElementById('resultadoDes'); // Texto desencriptado

// Mapa para recordar dónde había letras y dónde caracteres especiales
let mapaOriginal = [];

// ─────────────────────────────────────────────────────────────
// Evento: cada vez que el usuario escribe, actualiza contador y matriz
// ─────────────────────────────────────────────────────────────
mensaje.addEventListener('input', () => {
    const len = mensaje.value.length;       // Longitud actual del texto
    charCount.textContent = `${len}/30`;    // Actualiza "x/30"
    mostrarMatrizMensaje();                 // Muestra la representación en forma de matriz
});

// ─────────────────────────────────────────────────────────────
// Función: muestra el mensaje como matriz de pares numéricos
//          (A=0, B=1, ..., Z=25) con relleno 23 (X) si falta uno
// ─────────────────────────────────────────────────────────────
function mostrarMatrizMensaje() {
    // Convierte a mayúsculas y elimina todo lo que no sea A-Z
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        matrizMensaje.textContent = 'Escribe un mensaje primero...';
        return;
    }

    // Convierte cada letra a un número 0–25 restando 65 (código ASCII de 'A')
    const valores = texto.split('').map(char => char.charCodeAt(0) - 65);

    // Construye la "matriz" visual como [[v1,v2] [v3,v4] ...]
    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';       // Espacio entre parejas

        matriz += '[' + valores[i];     // Primer valor del par

        if (i + 1 < valores.length)    // Si hay segundo valor en el par
            matriz += ', ' + valores[i + 1];
        else                           // Si falta uno, rellena con 23 (X)
            matriz += ', 23';

        matriz += ']';
    }
    matriz += ']';

    matrizMensaje.textContent = matriz;
}

// ─────────────────────────────────────────────────────────────
// Función genérica para procesar (encriptar o desencriptar)
// según la matriz 'key' que se le pase.
// Si 'key' es la original → ENCRIPTA
// Si 'key' es la inversa  → DESENCRIPTA
// ─────────────────────────────────────────────────────────────
function procesar(texto, key) {
    // Convierte texto a números 0–25
    let numeros = texto.split('').map(c => c.charCodeAt(0) - 65);

    // Si el total de números es impar, se agrega un 23 (X) para completar el par
    if (numeros.length % 2 !== 0) numeros.push(23);

    let salida = '';

    // Se recorre de 2 en 2 (pares de letras)
    for (let i = 0; i < numeros.length; i += 2) {
        const v1 = numeros[i];
        const v2 = numeros[i + 1];

        // Multiplicación matricial:
        // [c1]   [a b][v1]
        // [c2] = [c d][v2]
        const c1 = (key[0][0] * v1 + key[0][1] * v2) % 26;
        const c2 = (key[1][0] * v1 + key[1][1] * v2) % 26;

        // Corrección para valores negativos (mod 26 "bien hecho")
        const n1 = ((c1 % 26) + 26) % 26;
        const n2 = ((c2 % 26) + 26) % 26;

        // Convierte de vuelta a letras (0→A, 1→B, ..., 25→Z)
        salida += String.fromCharCode(65 + n1) + String.fromCharCode(65 + n2);
    }

    return salida;
}

// ─────────────────────────────────────────────────────────────
// Obtiene la matriz clave 2x2 a partir de los inputs del usuario
// ─────────────────────────────────────────────────────────────
function obtenerKey() {
    const key = [
        [parseInt(k11.value), parseInt(k12.value)],
        [parseInt(k21.value), parseInt(k22.value)]
    ];

    // Si algún valor es NaN, la clave es inválida
    if (key.flat().some(v => Number.isNaN(v))) {
        mostrarError("La matriz clave tiene valores vacíos o inválidos");
        return null;
    }

    return key;
}

// ─────────────────────────────────────────────────────────────
// Inverso modular: busca x tal que (a * x) % m == 1
// ─────────────────────────────────────────────────────────────
function modularInverse(a, m) {
    // Normaliza 'a' en rango [0, m)
    a = ((a % m) + m) % m;

    // Búsqueda simple del inverso
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }

    // Si no existe inverso
    return null;
}

// ─────────────────────────────────────────────────────────────
// Obtiene la matriz inversa de la clave en aritmética mod 26.
// Esta matriz inversa es la que se usa para DESENCRIPTAR.
// ─────────────────────────────────────────────────────────────
function obtenerMatrizInversa(key) {
    // Determinante: det = ad - bc
    const detRaw = key[0][0] * key[1][1] - key[0][1] * key[1][0];

    // Normaliza el determinante a [0,25]
    const det = ((detRaw % 26) + 26) % 26;

    // Inverso modular del determinante
    const detInv = modularInverse(det, 26);

    // Si det = 0 o no hay inverso → matriz no invertible
    if (det === 0 || detInv === null) return null;

    const a = key[0][0], b = key[0][1];
    const c = key[1][0], d = key[1][1];

    // Matriz adjunta * detInv (todo mod 26):
    // inv = (1/det) * [ d  -b ]
    //                  [-c   a ]
    const inv = [
        [(d * detInv) % 26, ((-b) * detInv) % 26],
        [((-c) * detInv) % 26, (a * detInv) % 26]
    ];

    // Normaliza cada valor a rango [0,25]
    return inv.map(row => row.map(v => ((v % 26) + 26) % 26));
}

// ─────────────────────────────────────────────────────────────
// Muestra mensajes de error en el elemento 'resultado'
// ─────────────────────────────────────────────────────────────
function mostrarError(msg) {
    resultado.textContent = msg;
    resultado.classList.add('error');
}

// ─────────────────────────────────────────────────────────────
// Genera un "mapa" del texto original para recordar qué era letra
// y qué era carácter especial (espacios, comas, etc.)
// ─────────────────────────────────────────────────────────────
function generarMapaOriginal(texto) {
    mapaOriginal = [];

    for (let i = 0; i < texto.length; i++) {
        // Si es una letra (A-Z / a-z)
        if (/^[A-Za-z]$/.test(texto[i])) {
            mapaOriginal.push({ tipo: 'L', valor: texto[i] }); // L = Letra
        } else {
            mapaOriginal.push({ tipo: 'E', valor: texto[i] }); // E = Especial
        }
    }
}

// ─────────────────────────────────────────────────────────────
// Reconstruye el formato original (espacios, comas, etc.) usando
// el mapa original y el texto en claro desencriptado.
// ─────────────────────────────────────────────────────────────
function reconstruirFormato(originalMap, textoPlano) {
    let indiceLetra = 0;  // Índice para recorrer las letras del texto plano
    let salida = '';

    for (let item of originalMap) {
        if (item.tipo === 'L') {
            // Sustituye por la siguiente letra desencriptada
            salida += textoPlano[indiceLetra] || '';
            indiceLetra++;
        } else {
            // Conserva el carácter especial tal cual (espacio, coma, etc.)
            salida += item.valor;
        }
    }

    return salida;
}

// ─────────────────────────────────────────────────────────────
// EVENTO: ENCRIPTAR
// Toma el mensaje, guarda el formato, se queda con solo letras,
// aplica la matriz clave original y muestra el resultado cifrado.
// ─────────────────────────────────────────────────────────────
btnEncriptar.addEventListener('click', () => {
    // Limpia el resultado de desencriptado
    resultadoDes.textContent = '';

    const texto = mensaje.value;            // Texto tal cual lo escribió el usuario

    // Guarda el "mapa" de letras y caracteres especiales
    generarMapaOriginal(texto);

    // Convierte a mayúsculas y se queda solo con letras A-Z
    const soloLetras = texto.toUpperCase().replace(/[^A-Z]/g, '');

    // Si no hay letras, error
    if (soloLetras.length === 0) return mostrarError("Ingresa un mensaje con letras");

    // Obtiene la matriz clave
    const key = obtenerKey();
    if (!key) return;   // Si hay error en la clave, no continúa

    // ENCRIPTADO: usa la matriz ORIGINAL 'key'
    resultado.textContent = procesar(soloLetras, key);

    // Quita la clase de error si estaba puesta
    resultado.classList.remove('error');
});

// ─────────────────────────────────────────────────────────────
// EVENTO: DESENCRIPTAR
// A partir del texto cifrado en 'resultado' y la misma clave,
// calcula la matriz inversa y recupera el texto plano.
// ─────────────────────────────────────────────────────────────
btnDesencriptar.addEventListener('click', () => {

    // Limpia cualquier estilo de error previo
    resultado.classList.remove('error');

    // Toma el texto cifrado de 'resultado', lo recorta y se queda con solo letras
    const textoCifrado = (resultado.textContent || '')
        .trim()
        .replace(/[^A-Z]/g, '');

    // Si no hay nada para desencriptar, muestra error
    if (textoCifrado.length === 0)
        return mostrarError("No hay texto encriptado para desencriptar");

    // Obtiene la misma matriz clave que se usó para cifrar
    const key = obtenerKey();
    if (!key) return;

    // ─────────────────────────────────────────────────────
    // ⚠️ AQUÍ EMPIEZA FORMALMENTE EL PROCESO DE DESENCRIPTADO
    // ─────────────────────────────────────────────────────

    // 1) Calcula la matriz INVERSA de la clave en mod 26
    const inversa = obtenerMatrizInversa(key);

    // Si la matriz no es invertible, no se puede desencriptar
    if (!inversa) return mostrarError("La matriz no es invertible");

    // 2) Usa la función 'procesar' con la MATRIZ INVERSA
    //    Esto invierte el cifrado y recupera el texto plano (solo letras)
    const desencriptado = procesar(textoCifrado, inversa); // ← AQUÍ SE DESENCRIPTA

    // 3) Reconstruye el formato original (espacios, comas, etc.)
    const finalConFormato = reconstruirFormato(mapaOriginal, desencriptado);

    // 4) Muestra el resultado final desencriptado en 'resultadoDes'
    resultadoDes.textContent = finalConFormato;
    resultadoDes.classList.remove('error');
}); 