# Generador y Publicador de Hilos en Twitter

Este proyecto es una herramienta automatizada para generar contenido utilizando APIs de inteligencia artificial y publicarlo como hilos en Twitter.

## Características

- Generación de contenido dinámico utilizando dos APIs compatibles: **Grok** y **Gemini Pro**.
- Publicación automatizada de hilos en Twitter.
- Almacenamiento local de los últimos hilos generados para evitar duplicados.

## Requisitos previos

Antes de usar este proyecto, asegúrate de tener:

1. **Node.js** instalado en tu sistema.
2. Un archivo `.env` configurado con las claves necesarias.
3. Acceso a las APIs de **Grok** y/o **Gemini Pro**.
4. Credenciales de una aplicación de Twitter con permisos de escritura.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone <url_del_repositorio>
   cd <nombre_del_repositorio>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   GEMINI_API_KEY=tu_clave_de_gemini
   GROK_API_KEY=tu_clave_de_grok
   IA=GEMINI # O GROK, dependiendo de la API que desees utilizar
   TWITTER_API_KEY=tu_api_key
   TWITTER_API_SECRET=tu_api_secret
   TWITTER_ACCESS_TOKEN=tu_access_token
   TWITTER_ACCESS_TOKEN_SECRET=tu_access_token_secret
   TWITTER_ACCESS_BEARER_TOKEN=tu_access_bearer_token
   TEMA=el_tema_del_hilo
   SYSTEM_PROMPT=prompt_base_para_generar_contenido
   ```

4. Asegúrate de que el archivo `ultimoshilos.json` exista en la raíz del proyecto. Si no, créalo vacío:
   ```json
   []
   ```

## Uso

### Ejecución del script

Para iniciar el script y generar automáticamente contenido y publicarlo en Twitter, ejecuta:

```bash
node index.js
```

El script realiza las siguientes tareas:

1. **Generación de contenido**:
   - Llama a la API configurada (Grok o Gemini Pro) para generar contenido basado en los hilos previos almacenados y el tema proporcionado.
   - Guarda los nuevos hilos en `ultimoshilos.json`.

2. **Publicación del hilo**:
   - Publica los tweets como un hilo en tu cuenta de Twitter.

3. **Automatización**:
   - Después de publicar un hilo, el script entra en modo de espera (12 horas) y vuelve a ejecutar el proceso.

### Modificar el tema del contenido

Para cambiar el tema, simplemente edita la variable `TEMA` en el archivo `.env`.

## Detalles de las APIs

### Grok

El archivo `grok.js` interactúa con la API de **Grok** para generar contenido. 

- **Endpoint**: `https://api.x.ai/v1/chat/completions`
- **Método de autenticación**: Clave API (`GROK_API_KEY`).
- **Funcionamiento**:
  - Construye un mensaje con el tema configurado y excluye hilos previos.
  - Formatea la respuesta en un JSON schema que divide el contenido en tweets de menos de 280 caracteres.

### Gemini Pro

El archivo `gemini.js` interactúa con la API de **Google Generative AI (Gemini Pro)** para generar contenido.

- **Modelo utilizado**: `gemini-1.5-flash`
- **Método de autenticación**: Clave API (`GEMINI_API_KEY`).
- **Funcionamiento**:
  - Genera un hilo basado en un tema especificado.
  - Retorna los tweets como un array de cadenas (`Array<tweet>`).
  - Procesa la respuesta en JSON para ajustarse al formato requerido.

### Archivo de configuración `.env`

El archivo `.env` debe contener:

```env
GEMINI_API_KEY=clave_para_gemini
GROK_API_KEY=clave_para_grok
IA=GEMINI # O GROK, dependiendo de la API seleccionada
TWITTER_API_KEY=tu_api_key
TWITTER_API_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_TOKEN_SECRET=tu_access_token_secret
TWITTER_ACCESS_BEARER_TOKEN=tu_access_bearer_token
TEMA=el_tema_para_el_hilo
SYSTEM_PROMPT=prompt_base_para_generar_el_contenido
```

## Dependencias

- [fs](https://nodejs.org/api/fs.html): Para manejar el sistema de archivos.
- [dotenv](https://www.npmjs.com/package/dotenv): Para cargar las variables de entorno.
- [twitter-api-v2](https://www.npmjs.com/package/twitter-api-v2): Para interactuar con la API de Twitter.
- [node-fetch](https://www.npmjs.com/package/node-fetch): Para realizar solicitudes HTTP.
- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai): Cliente para interactuar con la API de Gemini Pro.

## Notas

- Este script está diseñado para ejecutarse de manera continua. Asegúrate de detener el proceso si necesitas realizar cambios.
- Configura correctamente tus claves y permisos en las APIs utilizadas para evitar errores al generar contenido o publicar.

## Licencia

Este proyecto está disponible bajo la licencia MIT.
