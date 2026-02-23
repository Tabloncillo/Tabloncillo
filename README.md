# 🏀 Tabloncillo — Baloncesto Cubano

**La app de la Liga de Baloncesto de La Habana en tu bolsillo.**

Tabloncillo es una Progressive Web App (PWA) diseñada para seguir en tiempo real la liga provincial de baloncesto de La Habana, Cuba. Funciona completamente offline, cabe en un solo archivo HTML, y está optimizada para conexiones lentas y dispositivos Android/iOS.

---

## ✨ Funcionalidades

### Para Fanáticos
- 📊 **Tabla de posiciones** en tiempo real con los 14 municipios
- 🏀 **Resultados de juegos** con box scores completos
- 📈 **Líderes estadísticos** — puntos, rebotes, asistencias, robos, bloqueos
- 🏅 **MVP Tracker** — seguimiento automático del Jugador Más Valioso
- 🏆 **Bracket de Playoffs** — semifinales y final
- 📅 **Calendario** de juegos programados
- 👤 **Perfiles de jugadores** con estadísticas detalladas
- ⭐ **All-Star voting** — vota por tus jugadores favoritos
- 🔮 **Pronósticos** — predice ganadores y compite con amigos

### Para Reporteros
- 🏀 **Modo Cancha** — interfaz courtside para reportar en vivo
- ⏱️ **Reloj de juego** con períodos y buzzer
- ⏱️ **Reloj de posesión** (24/14 segundos) con buzzer
- 📝 **Jugada por jugada** — registro detallado de cada acción
- 📋 **Box score PDF** — genera e imprime estadísticas oficiales
- 📱 **Sincronización WhatsApp** — comparte resultados instantáneamente
- 📸 **Social media cards** — genera imágenes listas para Instagram (1080×1350)

### Para Administradores
- 👥 **Editor de equipos** — nombres, logos, plantillas, fotos de jugadores
- ⭐ **Patrocinadores** — añade negocios locales como sponsors de cada equipo
- 💾 **Respaldo completo** — exporta/importa todo (juegos, logos, fotos) en un archivo JSON
- 📊 **Analytics** — contador de visitas local + integración GoatCounter
- 🗄️ **Archivo de temporadas** — guarda temporadas completas para la historia
- 🔧 **Multi-reporter** — PINs separados para admin (1976) y reporteros (2026)

---

## 🚀 Instalación

### Opción 1: GitHub Pages (Recomendado)
1. Haz fork de este repositorio
2. Ve a Settings → Pages
3. Selecciona Branch: `main`, Folder: `/ (root)`
4. Tu app estará en `https://tu-usuario.github.io/tabloncillo/`

### Opción 2: Cualquier hosting estático
Sube `index.html` a cualquier servidor web. No necesita backend, base de datos, ni Node.js.

### Opción 3: Abrir localmente
Simplemente abre `index.html` en cualquier navegador moderno.

---

## 📱 Instalar como App

### Android
- Abre la página en Chrome
- Aparecerá un banner "Instalar Tabloncillo"
- Toca "Instalar" → aparece en tu pantalla de inicio

### iPhone/iPad
- Abre la página en Safari
- Toca el botón Compartir (⬆)
- Selecciona "Añadir a pantalla de inicio"

---

## 📊 Analytics

Tabloncillo incluye dos sistemas de tracking:

1. **Local** — Contador integrado visible en Admin → Herramientas (visitas diarias, totales, gráfica de 7 días)
2. **GoatCounter** — Analytics externo gratuito y respetuoso con la privacidad

### Configurar GoatCounter:
1. Crea una cuenta gratis en [goatcounter.com](https://goatcounter.com)
2. Elige un subdominio (ej: `tabloncillo.goatcounter.com`)
3. En `index.html`, busca la línea:
   ```html
   <script data-goatcounter="https://tabloncillo.goatcounter.com/count"
   ```
4. Cambia `tabloncillo` por tu subdominio
5. Accede a tu dashboard en `https://tu-subdominio.goatcounter.com`

---

## 🏗️ Arquitectura

```
index.html          ← TODO el app (HTML + CSS + JS en un archivo)
README.md           ← Este archivo
```

**Stack:** Vanilla JavaScript, sin frameworks, sin dependencias, sin build step.

**Almacenamiento:** localStorage del navegador (~5-10MB)
- Juegos, estadísticas, calendario
- Logos de equipos (JPEG 200×200)
- Fotos de jugadores (JPEG 150×150)
- Perfiles de usuario, bracket, votos

**Respaldo:** Exporta todo a un archivo JSON (3-5MB con imágenes). Importa en cualquier dispositivo para clonar el estado completo.

---

## 🏀 Los 14 Equipos

| ID  | Equipo      | Municipio      |
|-----|-------------|----------------|
| PLY | Tiburones   | Playa          |
| CRO | Cimarrones  | Cerro          |
| D10 | Huracanes   | 10 de Octubre  |
| CTH | Gladiadores | Centro Habana  |
| HVJ | Corsarios   | Habana Vieja   |
| MRN | Alacranes   | Marianao       |
| LIS | Panteras    | La Lisa        |
| REG | Mambises    | Regla          |
| GBK | Gallos      | Guanabacoa     |
| BOY | Águilas     | Boyeros        |
| ARN | Caribes     | A. Naranjo     |
| COT | Caimanes    | Cotorro        |
| SMP | Dragones    | San Miguel     |
| PLZ | Capitales   | Plaza          |

*Los nombres y colores son editables desde el panel de administración.*

---

## 🔑 Acceso Admin

- **PIN Admin:** `1976` — acceso completo (editar equipos, logos, bracket, herramientas)
- **PIN Reporter:** `2026` — puede reportar juegos y usar modo cancha

*Cambia estos PINs en el código fuente (busca `ADMIN_PIN` y `REP_PIN`).*

---

## 📋 Flujo de Trabajo

### Día de juego:
1. El reportero llega a la cancha y abre Tabloncillo
2. Admin → Cancha → selecciona equipos → inicia juego
3. Registra jugadas en tiempo real (canastas, faltas, rebotes...)
4. Al terminar, el juego se guarda automáticamente
5. Comparte el resultado por WhatsApp (se copia al clipboard)
6. Los fanáticos ven el resultado y stats al instante

### Distribución:
1. Admin exporta respaldo completo (Herramientas → Exportar Todo)
2. Envía el archivo JSON por WhatsApp a otros reporteros
3. Ellos importan → tienen toda la data sincronizada

---

## 🤝 Contribuir

Tabloncillo es un proyecto comunitario para el baloncesto cubano. Si quieres contribuir:

1. Haz fork del repo
2. Crea una rama (`git checkout -b mi-mejora`)
3. Haz commit de tus cambios
4. Abre un Pull Request

---

## 📄 Licencia

Hecho con ❤️ para el baloncesto cubano. Úsalo, modifícalo, compártelo.

---

**★ Si te gusta Tabloncillo, dale una estrella al repo ★**
