# Tecnológico de Software

## Materia: Fundamentos de álgebra

## Alumno: Leonardo Balmes Solis

## Grupo: B

## Actividad #21. Cifrado hill

  

# Índice

  

1. [Objetivo](#objetivo)

2. [Cifrado Hill](#cifrado-hill)

3. [Conceptos básicos del Cifrado Hill](#conceptos-básicos-del-cifrado-hill)

4. [Proceso de cifrado con Hill](#proceso-de-cifrado-con-hill)

1. [Matriz de clave](#a)

2. [Preparación del texto](#2-preparación-del-texto)

3. [Multiplicación de la matriz clave](#3-multiplicación-de-la-matriz-clave-con-el-vector-de-texto)

4. [Repetir para cada bloque](#4-repetir-para-cada-bloque)

5. [Proceso de descifrado](#proceso-de-descifrado)

1. [Calcular la matriz inversa](#1-calcular-la-matriz-inversa-de--k-)

2. [Deshacer el proceso de cifrado](#2-deshacer-el-proceso-de-cifrado)

6. [Ejemplo de cifrado y descifrado](#ejemplo-de-cifrado-y-descifrado-con-hill)

7. [Estructura del proyecto](#estructura-del-proyecto)

8. [Instrucciones de uso](#%EF%B8%8F-instrucciones-de-uso)

9. [Interfaz de usuario](#interfaz-de-usuario)

10. [Paleta de colores](#paleta-de-colores-purple--dark-pastel)

11. [Tipografías](#tipografías-google-fonts)

12. [Iconografía y estilo general](#iconografía-y-estilo-general)

13. [Estilo de las cajas de resultado](#estilo-de-las-cajas-de-resultado)

14. [Estado de error](#estado-de-error)

15. [Layout general](#layout-general)

16. [Despliegue](#despligue-de-calculadora)

17. [Control de versiones](#control-de-versiones)

  

### Objetivo

Realizar un programa que implemente el cifrado y el des-encriptado Hill, de los datos a través de matrices.

  

### Cifrado Hill

Un **cifrado simétrico** que utiliza **álgebra matricial** para encriptar el texto. Fue desarrollado por **Lester S. Hill** en 1929 y es uno de los primeros cifrados de sustitución polialfabética. A diferencia de otros cifrados de sustitución, donde se sustituye una letra por otra, el cifrado Hill usa matrices para procesar bloques de texto, lo que lo hace más difícil de descifrar que los cifrados tradicionales.

  

### Conceptos básicos del Cifrado Hill

Para entender cómo funciona el cifrado Hill, es importante comprender varios conceptos fundamentales:

  

1.  **Alfabeto**: En el cifrado Hill, el alfabeto se mapea a un conjunto de números. Por ejemplo, si usamos el alfabeto inglés, podemos asignar valores a las letras de la siguiente forma:

  

- A = 0

- B = 1

- C = 2

- D = 3

- ...

- Z = 25

  

Esto permite representar las letras como números en lugar de caracteres.

  

2.  **Matrices**: El cifrado Hill se basa en la multiplicación de matrices. Utiliza una matriz cuadrada $K$ de tamaño $n \times n$ como clave, y divide el texto en bloques de $n$ letras. Luego, convierte estos bloques en vectores de $n$ dimensiones (con los números que representan las letras) y realiza multiplicaciones de matrices para obtener los valores cifrados.

  

3.  **Matriz clave**: La matriz clave $K$ es la clave para el cifrado. Debe ser una matriz invertible en módulo 26 (si estamos usando el alfabeto inglés). La inversibilidad es esencial porque de lo contrario no podríamos descifrar el mensaje.

  

### Proceso de cifrado con Hill

Supongamos que estamos usando un **cifrado Hill de 2x2** (es decir, bloques de 2 letras), donde las letras del texto se representan por números del 0 al 25. Para cifrar el mensaje, realizamos lo siguiente:

  

#### 1. **Matriz de clave $K$**

  

La clave en un cifrado Hill es una **matriz cuadrada** de $n \times n$. En un cifrado de 2x2, la matriz clave tendrá la siguiente forma:

  

$a \quad b$

  

$c \quad d$

  

Esta matriz será utilizada para transformar los bloques de texto en su versión cifrada. Debe ser invertible en el sistema modular 26.

  

#### 2. **Preparación del texto**

  

El texto claro se divide en bloques de tamaño $n$. En un ejemplo de 2x2, el texto se dividiría en bloques de 2 letras. Si el número de letras en el texto no es múltiplo de 2, se agrega un carácter adicional (como "X") para completar el bloque.

  

Por ejemplo, si el texto es "HELLO", se mapea a números (suponiendo el alfabeto A=0, B=1, ..., Z=25):

  

H = 7, E = 4, L = 11, L = 11, O = 14

  

Entonces, los bloques serían:
Bloque 1: "HE" →
| 7 |
| 4 |

Bloque 2: "LL" →
| 11 |
| 11 |

Bloque 3: "LO" →
| 11 |
| 14 |

Este bloque corresponde a las letras **"IH"** (usando el mapeo A=0, B=1, ..., Z=25).

  

#### 4. **Repetir para cada bloque**

  

Este proceso se repite para todos los bloques de texto. Por ejemplo, el segundo bloque "LL" se multiplicaría de manera similar, y así sucesivamente para todo el texto.

  

---

  

### Proceso de descifrado

  

El proceso de descifrado en el cifrado Hill también se basa en álgebra matricial, pero en lugar de usar la matriz clave, usamos la **inversa de la matriz clave**. La inversa de la matriz $K$, denotada $K^{-1}$, es esencial para recuperar el texto original.

  

El descifrado de un bloque se realiza multiplicando el vector cifrado por la inversa de la matriz clave:

  
$$
K^{-1} \cdot C = P
$$


  

Donde $C$ es el vector cifrado, $K^{-1}$ es la matriz inversa de la clave, y $P$ es el vector de texto claro.

  

#### 1. **Calcular la matriz inversa de $K$**

  

Para encontrar la matriz inversa de $K$, usamos la fórmula para la inversa de una matriz $2  \times  2$:

  

$$
K^{-1} = \frac{1}{\text{det}(K)} \cdot  \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \mod  26
$$

  

Donde la determinante de $K$ es:

  

$$
\text{det}(K) = (a \times d - b \times c) \mod  26
$$

  

Luego, se invierte el determinante en módulo 26 (esto solo es posible si el determinante tiene un inverso en módulo 26).

  

#### 2. **Deshacer el proceso de cifrado**

  

Para descifrar, se multiplican los vectores cifrados por la inversa de $K$ para recuperar el texto original.

  

---

  

### Ejemplo de cifrado y descifrado con Hill

  

Supongamos que tenemos el siguiente:

  

-  **Texto claro**: "HELLO"

-  **Matriz clave**:

$$
K = \begin{pmatrix} 6 & 24 \\ 1 & 13  \end{pmatrix}
$$

  

**Cifrado**: Usando las reglas descritas anteriormente, ciframos "HELLO" en bloques de 2 letras, usando la matriz clave $K$.

  

Después de realizar la multiplicación de matrices, obtenemos el texto cifrado "IH" y otros bloques similares.

  

**Descifrado**: Calculamos la inversa de la matriz clave $K^{-1}$ y multiplicamos los bloques cifrados por esta matriz para recuperar el texto claro.

  

---

  

### Estructura del proyecto

  

EncriptacionHill/

├── README.md # Documentación del proyecto

├── index.html # Interfaz principal

├── style.css # Estilos y diseñogit

└── script.js # Lógica de encriptación y desencriptación

  
  

---

  

## ▶️ Instrucciones de uso

  

### **1️⃣ Descargar el proyecto**

  

Descarga la carpeta completa del repositorio **EncriptacionHill/** y asegúrate de incluir:

  

`index.html

styles.css

script.js

README.md`

  

### **2️⃣ Extraer y abrir**

  

Si descargaste un ZIP, extráelo y abre la carpeta donde están los archivos del proyecto.

  

### **3️⃣ Ejecutar la aplicación**

  

Haz doble clic en **index.html** para abrir la interfaz directamente en tu navegador.

No requiere instalaciones adicionales.

  

### **4️⃣ Escribir un mensaje**

  

Ingresa el texto que deseas encriptar.

Pueden incluirse espacios, símbolos, acentos o caracteres especiales; serán preservados al desencriptar.

  

### **5️⃣ Ingresar la matriz clave**

  

Completa los 4 valores numéricos correspondientes a la matriz $2  \times  2$:

  

`[a] [b] [c] [d]`

  

La matriz debe ser **invertible módulo 26**.

  

### **6️⃣ Encriptar**

  

Presiona el botón **Encriptar** para generar el mensaje cifrado.

El resultado aparecerá en la primera caja de salida.

  

### **7️⃣ Desencriptar**

  

Presiona **Desencriptar** para aplicar la matriz inversa y recuperar el mensaje original.

La restauración conserva todos los espacios y caracteres especiales.

  

---

  

## Interfaz de usuario

### Paleta de colores (purple / dark pastel)

  

Colores utilizados en el proyecto:

  

Elemento | Color | Uso
Fondo general del sitio | `#2b0030` → `#000000` | Gradiente principal
--- | --- | ---
Contenedor principal | `#1a001f` | Tarjeta central
--- | --- | ---
Bordes principales | `#6a0dad` | Líneas y acentos
--- | --- | ---
Hover / acentos brillantes | `#9b4dff`, `#b060ff` | Transiciones y efectos glow
--- | --- | ---
Texto principal | `#E3D7FF` | Alta legibilidad
--- | --- | ---
Títulos | `#D9B3FF` | Títulos y encabezados
--- | --- | ---
Texto secundario | `#c7a4ff` | Contadores y subtítulos
--- | --- | ---
Errores - fondo | `#7a0033` | Panel de error
--- | --- | ---
Errores - borde | `#ff4f8b` | Señalización
--- | --- | ---
Errores - texto | `#FFD6E8` | Mensajes de advertencia
--- | --- | ---
  

---

  

## Tipografías (Google Fonts)

  

Se utiliza la tipografía:

  

`Poppins (300, 400, 600)`

  

Importada mediante:

  

`<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">`

  

Características:

  

- Moderna y redondeada

- Buena legibilidad en fondos oscuros

- Adecuada para interfaces técnicas

  

---

  

## Iconografía y estilo general

  

Aunque no se emplean íconos en este proyecto, la interfaz mantiene un estilo consistente:

  

- Esquinas redondeadas en contenedores y entradas (`border-radius: 6px` y `16px`)

- Sombras suaves moradas (`box-shadow`)

- Animaciones utilizadas:

-  `fadeIn` para entrada gradual

-  `slide` para aparición del contenedor

- Botones con transición suave y efecto de brillo al pasar el cursor

- Uso de tipografía monoespaciada en matrices:

-  `"Courier New", monospace`

  

---

  

## Estilo de las cajas de resultado

  

Clases importantes: `.resultado-box` y `.matriz-display`

  

Configuración:

  

`background: #120014; border: 2px solid #6a0dad; border-radius: 6px; color: #E3D7FF; font-family: "Courier New", monospace; animation: fadeIn 0.5s ease;`

  

Proporciona:

  

- Fondo oscuro para alto contraste

- Borde morado pastel

- Legibilidad tipo terminal

- Efecto de aparición suave

  

---

  

## Estado de error

  

Clase utilizada: `.error`

  

`background: #7a0033; border-color: #ff4f8b; color: #FFD6E8; padding: 10px; border-radius: 6px; font-weight: bold;`

  

Indica:

  

- Fondo rojo oscuro para advertencias

- Borde vibrante para destacar errores

- Texto claro y legible

  

---

  

## Layout general

  

El diseño de la página usa:

  

`display: flex; justify-content: center; align-items: center;`

  

Además:

  

-  `max-width: 650px` para el contenedor principal

- Secciones separadas con márgenes balanceados

- Diseño centrado y responsivo

- Orden limpio para facilitar la interacción del usuario

  

---

  

## Despliegue de calculadora

[Encriptación Hill](https://angellugo.netlify.app/)

  

# Control de versiones

  

[](https://github.com/bylev/EncriptacionHill?tab=readme-ov-file#control-de-versiones)

  

El proyecto está versionado con Git, con commits que reflejan:

  

- Creación de estructura base (HTML/CSS).

- Implementación del cifrado Hill.

- Agregado de desencriptación con matriz inversa módulo 26.

- Validaciones y manejo de errores.

- Ajustes visuales y despliegue en Netlify.# Proyecto_conPaginaFuncional
