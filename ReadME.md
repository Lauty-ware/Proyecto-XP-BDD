# 🏢 CoworkingHub — Backend con XP + BDD

Backend en **TypeScript** para un sistema de reservas de espacios de coworking, construido aplicando **Extreme Programming (XP)** y **Behavior-Driven Development (BDD)** con **Cucumber**.

## 🎯 Objetivo

Diseñar un backend robusto que permita a usuarios registrarse, reservar salas, cancelar reservas y consultar disponibilidad, además de permitir a administradores gestionar salas. Todo guiado por escenarios Gherkin ejecutables.

## 🧱 Arquitectura

Se aplica **Clean Architecture** con separación estricta de capas:

```
src/
├── domain/          # Entidades + errores del negocio (sin dependencias)
├── application/     # Casos de uso + puertos (interfaces de repos)
├── infrastructure/  # Adaptadores: repos en memoria, bcrypt, JWT
└── interfaces/      # HTTP (Express): controladores, rutas, middlewares
```

**Regla de dependencia:** `interfaces → infrastructure → application → domain`.
El dominio no conoce a nadie; la aplicación solo conoce al dominio.

## 🛠 Stack

| Capa | Tecnología |
|------|------------|
| Lenguaje | TypeScript (strict mode) |
| HTTP | Express 4 |
| Autenticación | JWT + bcryptjs |
| BDD | @cucumber/cucumber + ts-node |
| Linter | ESLint + @typescript-eslint |
| CI | GitHub Actions |

## 🚀 Instalación

```bash
# 1. Clonar
git clone <repo-url> && cd coworking-hub

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env

# 4. Levantar en modo desarrollo
npm run dev
```

API disponible en `http://localhost:3000/api`.

## 🧪 Ejecutar la Suite BDD (Cucumber)

```bash
npm run test:e2e
```

Se generará `cucumber-report.html` con el reporte visual.

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Levanta el servidor con hot-reload |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el build compilado |
| `npm run test:e2e` | Ejecuta Cucumber (features Gherkin) |
| `npm run lint` | Analiza el código con ESLint |
| `npm run typecheck` | Verifica tipos sin emitir |
| `npm run lint:fix` | Corrige problemas de lint automáticamente |

## 📡 Endpoints Principales

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Inicio de sesión (devuelve JWT) | No |
| GET | `/api/rooms?date=YYYY-MM-DD` | Listar salas disponibles | No |
| POST | `/api/rooms` | Crear sala | Admin |
| DELETE | `/api/rooms/:name` | Eliminar sala | Admin |
| POST | `/api/reservations` | Crear reserva | No |
| DELETE | `/api/reservations` | Cancelar reserva | No |

### Ejemplos con `curl`

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"Password123"}'

# Listar salas disponibles
curl "http://localhost:3000/api/rooms?date=2026-10-15"
```

## 🧠 Prácticas XP Aplicadas

### 1. **TDD/BDD (Test-First Development)**
Cada caso de uso nació de un escenario Gherkin fallando (fase RED). Luego se implementó la lógica mínima para pasarlo (GREEN) y finalmente se refactorizó.

### 2. **Diseño Simple (YAGNI)**
- No se usó ORM ni base de datos real en esta iteración; los repositorios en memoria cumplen el contrato de los **puertos**, por lo que migrar a PostgreSQL/Prisma es un cambio aislado.
- No se introdujo CQRS, event sourcing ni mensajería porque **no eran necesarios** para los requisitos actuales.

### 3. **Refactorización Continua**
- Se extrajeron **puertos** (`UserRepository`, `RoomRepository`, `ReservationRepository`) para invertir dependencias.
- Los errores del dominio se estandarizaron en `DomainError` con código, permitiendo mapear a HTTP en un middleware único.

### 4. **Integración Continua (CI)**
El pipeline en `.github/workflows/main.yml` ejecuta en cada push:
1. `lint` → calidad de código
2. `typecheck` → seguridad de tipos
3. `build` → compilación
4. `test:e2e` → suite BDD de Cucumber

### 5. **Ritmo Sostenible y Propiedad Colectiva**
- Convenciones claras (capas, nombres, contratos).
- Cualquier dev puede agregar un `feature` nuevo sin tocar infraestructura.

## 🥒 Ejemplo de Flujo BDD → Producción

**Feature:** `features/reservar_sala.feature`

```gherkin
Scenario: Reserva fallida por saldo insuficiente
  Given que existe un usuario "pobre@example.com" con saldo 10
  And que existe la sala "Sala A" con precio 50
  When "pobre@example.com" reserva la sala "Sala A" para el día "2026-10-15"
  Then la reserva debe fallar con mensaje "Saldo insuficiente"
```

**Paso 1 (RED):** Cucumber falla porque `ReserveRoom` no existe.
**Paso 2 (GREEN):** Se implementa `ReserveRoom` con la validación `if (user.balance < room.price) throw`.
**Paso 3 (REFACTOR):** Se extrae el mensaje a un `DomainError` con código `INSUFFICIENT_BALANCE` reutilizable.

## 🔐 Decisiones de Diseño

| Decisión | Justificación |
|----------|---------------|
| **Repositorios en memoria** | Permiten tests rápidos y aislados; el contrato (puerto) facilita migración a Prisma/TypeORM. |
| **bcrypt con 10 rounds** | Balance entre seguridad y latencia (< 200ms), alineado con HNF-01/HNF-02. |
| **JWT stateless** | Escalable horizontalmente sin sesiones compartidas. |
| **Middleware de errores centralizado** | Los casos de uso lanzan `DomainError`; el adaptador HTTP decide el status. |
| **Zod no usado aún** | YAGNI: los DTOs actuales son simples; se agregará cuando la validación se vuelva compleja. |

## 📂 Estructura de Directorios

```
coworking-hub/
├── .github/workflows/main.yml   # CI
├── docs/backlog.md              # Historias de usuario + criterios
├── features/                    # Escenarios Gherkin
├── src/                         # Código fuente
├── tests/                       # Step definitions + support
├── cucumber.js                  # Config de Cucumber
├── tsconfig.json
├── package.json
└── README.md
```

## 🧩 Cómo Agregar una Nueva Feature (Workflow XP)

1. **Escribir el `.feature`** en `features/` con happy path + caso de error.
2. Ejecutar `npm run test:e2e` → **falla (RED)**.
3. Implementar `tests/step_definitions/*.steps.ts` (si hace falta).
4. Ejecutar de nuevo → **falla por lógica no implementada**.
5. Crear/ajustar el **caso de uso** en `src/application/use-cases/`.
6. Enlazarlo en `src/container.ts` y `src/interfaces/http/routes/`.
7. Ejecutar `npm run test:e2e` → **GREEN** ✅
8. Refactorizar sin romper tests.
9. Push → CI valida todo.

## 🧭 Roadmap (Próximas iteraciones)

- [ ] Persistencia real con Prisma + PostgreSQL.
- [ ] Validación de DTOs con Zod.
- [ ] Tests unitarios con Jest sobre casos de uso.
- [ ] Rate limiting y helmet.
- [ ] Paginación y filtros avanzados en `/rooms`.
- [ ] Reservas por rango horario (no solo día completo).

## 📜 Licencia

MIT.