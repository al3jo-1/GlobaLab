# Guía de Conexión a Supabase para GlobalTradeLab

## ¿Qué es Supabase?

Supabase es una alternativa open-source a Firebase que proporciona una base de datos PostgreSQL, autenticación, almacenamiento y APIs en tiempo real. Es ideal para aplicaciones como GlobalTradeLab que necesitan gestionar usuarios, salas de trading y datos en tiempo real.

## Beneficios de Usar Supabase

1. **Base de Datos PostgreSQL Real** - Más potente que el almacenamiento local
2. **Autenticación Integrada** - Manejo seguro de usuarios y sesiones
3. **Actualizaciones en Tiempo Real** - Sincronización automática entre estudiantes y profesores
4. **Escalabilidad** - Soporta desde pocos hasta millones de usuarios
5. **Gratis para Empezar** - Plan gratuito generoso para desarrollo

## Paso 1: Crear una Cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Regístrate con tu email o GitHub
4. Verifica tu correo electrónico

## Paso 2: Crear un Nuevo Proyecto

1. En el dashboard de Supabase, haz clic en "New Project"
2. Completa los datos:
   - **Name**: GlobalTradeLab
   - **Database Password**: Elige una contraseña segura (¡guárdala!)
   - **Region**: Selecciona la más cercana a tus usuarios
   - **Pricing Plan**: Free (para empezar)
3. Haz clic en "Create new project"
4. Espera 2-3 minutos mientras se crea el proyecto

## Paso 3: Obtener las Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** → **API** en el menú lateral
2. Encontrarás estas credenciales importantes:
   - **Project URL**: `https://tuproyecto.supabase.co`
   - **anon/public key**: Una llave larga que empieza con `eyJ...`
   - **service_role key**: Otra llave (¡MUY IMPORTANTE: nunca la expongas en el frontend!)

## Paso 4: Agregar las Credenciales a Replit

En tu proyecto de Replit:

1. Abre la pestaña **Secrets** (icono de candado en el panel izquierdo)
2. Agrega estas variables:
   ```
   VITE_SUPABASE_URL=https://tuproyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```
3. Haz clic en "Add new secret" para cada una

## Paso 5: Crear TODAS las Tablas de la Base de Datos

En Supabase, ve a **SQL Editor** (en el menú lateral) para ejecutar estos comandos SQL. También puedes usar el **Table Editor** para crear las tablas visualmente, pero es más rápido copiar y pegar el SQL.

> **💡 Tip**: Puedes copiar cada bloque SQL y pegarlo en el SQL Editor de Supabase. Haz clic en "Run" para ejecutar cada comando.

### Tabla 1: users (Usuarios)

**Descripción**: Almacena la información de todos los usuarios de la plataforma (estudiantes y profesores).

**Campos**:
- `id`: Identificador único del usuario (UUID)
- `email`: Email del usuario (único)
- `username`: Nombre de usuario (único)
- `name`: Nombre completo del usuario
- `role`: Rol del usuario (student o teacher)
- `plan`: Plan de suscripción (starter, professional, enterprise)
- `balance`: Balance virtual para trading
- `avatar_url`: URL del avatar del usuario (opcional)
- `created_at`: Fecha de creación de la cuenta
- `updated_at`: Última actualización del perfil

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  balance DECIMAL DEFAULT 10000.00 NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 2: rooms (Salas de Trading)

**Descripción**: Representa las salas de trading creadas por los profesores donde los estudiantes practican.

**Campos**:
- `id`: Identificador único de la sala
- `name`: Nombre de la sala
- `class_code`: Código único para unirse a la sala
- `owner_id`: ID del profesor que creó la sala
- `description`: Descripción opcional de la sala
- `student_count`: Contador automático de estudiantes
- `is_active`: Si la sala está activa o archivada
- `created_at`: Fecha de creación de la sala

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  student_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 3: room_members (Miembros de Salas)

**Descripción**: Relación muchos-a-muchos entre usuarios y salas. Un estudiante puede estar en múltiples salas.

**Campos**:
- `id`: Identificador único de la membresía
- `room_id`: ID de la sala
- `user_id`: ID del usuario
- `joined_at`: Fecha en que el usuario se unió a la sala
- `is_active`: Si el usuario sigue activo en la sala

**Constraint**: Un usuario solo puede estar una vez en cada sala (UNIQUE constraint).

```sql
CREATE TABLE room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  UNIQUE(room_id, user_id)
);
```

---

### Tabla 4: positions (Posiciones Abiertas)

**Descripción**: Almacena las posiciones de trading actualmente abiertas de cada usuario en cada sala.

**Campos**:
- `id`: Identificador único de la posición
- `user_id`: ID del usuario dueño de la posición
- `room_id`: ID de la sala donde se abrió la posición
- `symbol`: Símbolo del activo (ej: BTCUSD, AAPL)
- `type`: Tipo de posición (long = compra, short = venta)
- `quantity`: Cantidad de activos
- `entry_price`: Precio de entrada
- `current_price`: Precio actual (se actualiza en tiempo real)
- `stop_loss`: Precio de Stop Loss (opcional)
- `take_profit`: Precio de Take Profit (opcional)
- `created_at`: Fecha de apertura de la posición
- `closed_at`: Fecha de cierre (null si está abierta)

```sql
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('long', 'short')),
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  entry_price DECIMAL NOT NULL CHECK (entry_price > 0),
  current_price DECIMAL,
  stop_loss DECIMAL CHECK (stop_loss > 0),
  take_profit DECIMAL CHECK (take_profit > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE
);
```

---

### Tabla 5: transactions (Historial de Transacciones)

**Descripción**: Registro completo de todas las transacciones de compra/venta realizadas por los usuarios.

**Campos**:
- `id`: Identificador único de la transacción
- `user_id`: ID del usuario que realizó la transacción
- `room_id`: ID de la sala donde se realizó
- `type`: Tipo de transacción (buy o sell)
- `symbol`: Símbolo del activo
- `quantity`: Cantidad transaccionada
- `price`: Precio al que se ejecutó
- `total`: Valor total de la transacción (quantity * price)
- `fee`: Comisión cobrada (opcional)
- `profit_loss`: Ganancia o pérdida (solo para ventas)
- `created_at`: Fecha y hora de la transacción

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  symbol TEXT NOT NULL,
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  price DECIMAL NOT NULL CHECK (price > 0),
  total DECIMAL NOT NULL,
  fee DECIMAL DEFAULT 0,
  profit_loss DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 6: pending_orders (Órdenes Pendientes) ⭐ NUEVA

**Descripción**: Órdenes de compra/venta que se ejecutarán automáticamente cuando el precio alcance un nivel específico.

**Tipos de órdenes**:
- **Buy Limit**: Comprar cuando el precio baje a un nivel específico
- **Sell Limit**: Vender cuando el precio suba a un nivel específico
- **Stop Loss**: Vender automáticamente para limitar pérdidas
- **Take Profit**: Vender automáticamente para asegurar ganancias

**Campos**:
- `id`: Identificador único de la orden
- `user_id`: ID del usuario que creó la orden
- `room_id`: ID de la sala
- `symbol`: Símbolo del activo
- `side`: Lado de la orden (buy o sell)
- `order_type`: Tipo de orden (limit, stop_loss, take_profit)
- `quantity`: Cantidad a negociar
- `trigger_price`: Precio que activará la orden
- `status`: Estado (pending, executed, cancelled, expired)
- `position_id`: ID de la posición relacionada (para stop_loss y take_profit)
- `execution_price`: Precio al que se ejecutó (null si no se ha ejecutado)
- `executed_at`: Fecha de ejecución
- `expires_at`: Fecha de expiración (opcional)
- `created_at`: Fecha de creación

```sql
CREATE TABLE pending_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('limit', 'stop_loss', 'take_profit')),
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  trigger_price DECIMAL NOT NULL CHECK (trigger_price > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled', 'expired')),
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  execution_price DECIMAL,
  executed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 7: price_alarms (Alarmas de Precio) ⭐ NUEVA

**Descripción**: Alarmas configuradas por usuarios para recibir notificaciones cuando un activo alcance cierto precio.

**Campos**:
- `id`: Identificador único de la alarma
- `user_id`: ID del usuario
- `room_id`: ID de la sala
- `symbol`: Símbolo del activo a monitorear
- `condition`: Condición (above = por encima, below = por debajo)
- `price`: Precio objetivo
- `triggered`: Si la alarma ya se activó
- `triggered_at`: Fecha en que se activó
- `is_active`: Si la alarma sigue activa
- `created_at`: Fecha de creación

```sql
CREATE TABLE price_alarms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  price DECIMAL NOT NULL CHECK (price > 0),
  triggered BOOLEAN DEFAULT false NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 8: notifications (Notificaciones) ⭐ NUEVA

**Descripción**: Sistema de notificaciones para profesores (ej: cuando un estudiante realiza una operación).

**Tipos de notificaciones**:
- `student_trade`: Un estudiante realizó una operación
- `order_executed`: Se ejecutó una orden pendiente
- `alarm_triggered`: Se activó una alarma de precio
- `system`: Notificaciones del sistema

**Campos**:
- `id`: Identificador único
- `user_id`: ID del usuario destinatario
- `room_id`: ID de la sala relacionada
- `type`: Tipo de notificación
- `title`: Título de la notificación
- `message`: Mensaje descriptivo
- `metadata`: Datos adicionales en formato JSON (ej: detalles de la operación)
- `read`: Si la notificación fue leída
- `created_at`: Fecha de creación

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('student_trade', 'order_executed', 'alarm_triggered', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 9: simulations (Historial de Simulaciones) ⭐ NUEVA

**Descripción**: Registro de simulaciones de eventos de mercado ejecutadas por profesores para enseñar.

**Tipos de simulaciones**:
- `crisis_2007`: Crisis financiera de 2007-2008
- `ww2`: Segunda Guerra Mundial (volatilidad extrema)
- `9_11`: Eventos del 11 de septiembre
- `elections`: Volatilidad por elecciones
- `custom`: Simulación personalizada

**Campos**:
- `id`: Identificador único
- `room_id`: ID de la sala donde se ejecutó
- `teacher_id`: ID del profesor que la inició
- `simulation_type`: Tipo de simulación
- `duration`: Duración en milisegundos
- `volatility_multiplier`: Multiplicador de volatilidad aplicado
- `trend_multiplier`: Multiplicador de tendencia
- `started_at`: Fecha de inicio
- `ended_at`: Fecha de finalización
- `created_at`: Fecha de registro

```sql
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  simulation_type TEXT NOT NULL CHECK (simulation_type IN ('crisis_2007', 'ww2', '9_11', 'elections', 'custom')),
  duration INTEGER NOT NULL,
  volatility_multiplier DECIMAL DEFAULT 1.0,
  trend_multiplier DECIMAL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 10: user_preferences (Preferencias de Usuario) ⭐ NUEVA

**Descripción**: Configuración personalizada de cada usuario (tema, idioma, preferencias de gráficos).

**Campos**:
- `id`: Identificador único
- `user_id`: ID del usuario (relación uno-a-uno)
- `theme`: Tema de la interfaz (light o dark)
- `language`: Idioma preferido (es, en, fr, de, it, pt, ru, hi)
- `chart_type`: Tipo de gráfico predeterminado (candlestick, line, area)
- `chart_interval`: Intervalo de tiempo (1m, 5m, 15m, 1h, 4h, 1d)
- `show_indicators`: Indicadores a mostrar (array JSON)
- `notifications_enabled`: Si las notificaciones están habilitadas
- `sound_enabled`: Si los sonidos están habilitados
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'hi')),
  chart_type TEXT DEFAULT 'candlestick' CHECK (chart_type IN ('candlestick', 'line', 'area')),
  chart_interval TEXT DEFAULT '15m' CHECK (chart_interval IN ('1m', '5m', '15m', '1h', '4h', '1d')),
  show_indicators JSONB DEFAULT '[]'::jsonb,
  notifications_enabled BOOLEAN DEFAULT true NOT NULL,
  sound_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

### Tabla 11: market_snapshots (Snapshots del Mercado) ⭐ NUEVA (Opcional)

**Descripción**: Capturas periódicas del estado del mercado para análisis histórico y reportes.

**Campos**:
- `id`: Identificador único
- `room_id`: ID de la sala
- `symbol`: Símbolo del activo
- `timestamp`: Momento del snapshot
- `open`: Precio de apertura
- `high`: Precio máximo
- `low`: Precio mínimo
- `close`: Precio de cierre
- `volume`: Volumen negociado
- `simulation_active`: Si había simulación activa
- `created_at`: Fecha de creación del registro

```sql
CREATE TABLE market_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  open DECIMAL NOT NULL,
  high DECIMAL NOT NULL,
  low DECIMAL NOT NULL,
  close DECIMAL NOT NULL,
  volume DECIMAL DEFAULT 0,
  simulation_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

## Paso 6: Configurar Row Level Security (RLS) 🔒

**¿Qué es RLS?** Row Level Security es un sistema de seguridad que controla qué filas de una tabla puede ver o modificar cada usuario. Es fundamental para proteger los datos.

En Supabase, ve a **Authentication** → **Policies** para cada tabla y habilita RLS. Luego, crea estas políticas:

### 6.1 Políticas para `users`

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propia información
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Los profesores pueden ver información de estudiantes en sus salas
CREATE POLICY "Teachers can view students in their rooms"
ON users FOR SELECT
TO authenticated
USING (
  role = 'student' AND
  EXISTS (
    SELECT 1 FROM room_members rm
    JOIN rooms r ON r.id = rm.room_id
    WHERE rm.user_id = users.id
    AND r.owner_id = auth.uid()
  )
);
```

### 6.2 Políticas para `rooms`

```sql
-- Habilitar RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Los profesores pueden crear salas
CREATE POLICY "Teachers can create rooms"
ON rooms FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = owner_id AND
  (SELECT role FROM users WHERE id = auth.uid()) = 'teacher'
);

-- Usuarios pueden ver salas donde son miembros
CREATE POLICY "Users can view their rooms"
ON rooms FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM room_members
    WHERE room_id = rooms.id AND user_id = auth.uid()
  )
);

-- Los profesores pueden actualizar sus propias salas
CREATE POLICY "Teachers can update their rooms"
ON rooms FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Los profesores pueden eliminar sus propias salas
CREATE POLICY "Teachers can delete their rooms"
ON rooms FOR DELETE
TO authenticated
USING (owner_id = auth.uid());
```

### 6.3 Políticas para `room_members`

```sql
-- Habilitar RLS
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- Estudiantes pueden unirse a salas
CREATE POLICY "Students can join rooms"
ON room_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver miembros de sus salas
CREATE POLICY "Users can view room members"
ON room_members FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM rooms
    WHERE id = room_members.room_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM room_members rm2
      WHERE rm2.room_id = rooms.id AND rm2.user_id = auth.uid()
    ))
  )
);

-- Usuarios pueden salir de salas
CREATE POLICY "Users can leave rooms"
ON room_members FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

### 6.4 Políticas para `positions`

```sql
-- Habilitar RLS
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden crear sus propias posiciones
CREATE POLICY "Users can create their positions"
ON positions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver sus propias posiciones
CREATE POLICY "Users can view their positions"
ON positions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Profesores pueden ver posiciones de estudiantes en sus salas
CREATE POLICY "Teachers can view student positions"
ON positions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rooms
    WHERE id = positions.room_id AND owner_id = auth.uid()
  )
);

-- Usuarios pueden actualizar sus propias posiciones
CREATE POLICY "Users can update their positions"
ON positions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden cerrar sus propias posiciones
CREATE POLICY "Users can close their positions"
ON positions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 6.5 Políticas para `transactions`

```sql
-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden crear sus propias transacciones
CREATE POLICY "Users can create their transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver su propio historial
CREATE POLICY "Users can view their transactions"
ON transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Profesores pueden ver transacciones de estudiantes en sus salas
CREATE POLICY "Teachers can view student transactions"
ON transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rooms
    WHERE id = transactions.room_id AND owner_id = auth.uid()
  )
);
```

### 6.6 Políticas para `pending_orders`

```sql
-- Habilitar RLS
ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden crear sus propias órdenes
CREATE POLICY "Users can create their orders"
ON pending_orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver sus propias órdenes
CREATE POLICY "Users can view their orders"
ON pending_orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuarios pueden actualizar/cancelar sus órdenes
CREATE POLICY "Users can update their orders"
ON pending_orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar sus órdenes
CREATE POLICY "Users can delete their orders"
ON pending_orders FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 6.7 Políticas para `price_alarms`

```sql
-- Habilitar RLS
ALTER TABLE price_alarms ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden crear sus propias alarmas
CREATE POLICY "Users can create their alarms"
ON price_alarms FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver sus propias alarmas
CREATE POLICY "Users can view their alarms"
ON price_alarms FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuarios pueden actualizar sus alarmas
CREATE POLICY "Users can update their alarms"
ON price_alarms FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar sus alarmas
CREATE POLICY "Users can delete their alarms"
ON price_alarms FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 6.8 Políticas para `notifications`

```sql
-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- El sistema puede crear notificaciones para cualquier usuario
-- (Esto se maneja desde el backend con service_role key)

-- Usuarios pueden ver sus propias notificaciones
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuarios pueden marcar como leídas sus notificaciones
CREATE POLICY "Users can update their notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar sus notificaciones
CREATE POLICY "Users can delete their notifications"
ON notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 6.9 Políticas para `simulations`

```sql
-- Habilitar RLS
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Solo profesores pueden crear simulaciones
CREATE POLICY "Teachers can create simulations"
ON simulations FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = teacher_id AND
  (SELECT role FROM users WHERE id = auth.uid()) = 'teacher'
);

-- Usuarios pueden ver simulaciones de sus salas
CREATE POLICY "Users can view simulations in their rooms"
ON simulations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rooms
    WHERE id = simulations.room_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM room_members
      WHERE room_id = rooms.id AND user_id = auth.uid()
    ))
  )
);
```

### 6.10 Políticas para `user_preferences`

```sql
-- Habilitar RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden crear sus preferencias
CREATE POLICY "Users can create their preferences"
ON user_preferences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver sus preferencias
CREATE POLICY "Users can view their preferences"
ON user_preferences FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuarios pueden actualizar sus preferencias
CREATE POLICY "Users can update their preferences"
ON user_preferences FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 6.11 Políticas para `market_snapshots`

```sql
-- Habilitar RLS
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver snapshots de sus salas
CREATE POLICY "Users can view snapshots in their rooms"
ON market_snapshots FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rooms
    WHERE id = market_snapshots.room_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM room_members
      WHERE room_id = rooms.id AND user_id = auth.uid()
    ))
  )
);
```

---

## Paso 7: Crear Índices para Optimización ⚡

Los índices mejoran significativamente el rendimiento de las consultas. Ejecuta estos comandos en el **SQL Editor**:

```sql
-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Índices para rooms
CREATE INDEX idx_rooms_owner_id ON rooms(owner_id);
CREATE INDEX idx_rooms_class_code ON rooms(class_code);
CREATE INDEX idx_rooms_is_active ON rooms(is_active);

-- Índices para room_members
CREATE INDEX idx_room_members_room_id ON room_members(room_id);
CREATE INDEX idx_room_members_user_id ON room_members(user_id);
CREATE INDEX idx_room_members_active ON room_members(is_active);

-- Índices para positions
CREATE INDEX idx_positions_user_id ON positions(user_id);
CREATE INDEX idx_positions_room_id ON positions(room_id);
CREATE INDEX idx_positions_symbol ON positions(symbol);
CREATE INDEX idx_positions_closed_at ON positions(closed_at);
-- Índice compuesto para posiciones abiertas
CREATE INDEX idx_positions_open ON positions(user_id, room_id) WHERE closed_at IS NULL;

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_room_id ON transactions(room_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Índices para pending_orders
CREATE INDEX idx_pending_orders_user_id ON pending_orders(user_id);
CREATE INDEX idx_pending_orders_room_id ON pending_orders(room_id);
CREATE INDEX idx_pending_orders_symbol ON pending_orders(symbol);
CREATE INDEX idx_pending_orders_status ON pending_orders(status);
-- Índice compuesto para órdenes pendientes activas
CREATE INDEX idx_pending_orders_active ON pending_orders(room_id, symbol, status) WHERE status = 'pending';

-- Índices para price_alarms
CREATE INDEX idx_price_alarms_user_id ON price_alarms(user_id);
CREATE INDEX idx_price_alarms_room_id ON price_alarms(room_id);
CREATE INDEX idx_price_alarms_symbol ON price_alarms(symbol);
CREATE INDEX idx_price_alarms_active ON price_alarms(is_active) WHERE is_active = true;

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_room_id ON notifications(room_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
-- Índice compuesto para notificaciones no leídas
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE read = false;

-- Índices para simulations
CREATE INDEX idx_simulations_room_id ON simulations(room_id);
CREATE INDEX idx_simulations_teacher_id ON simulations(teacher_id);
CREATE INDEX idx_simulations_type ON simulations(simulation_type);
CREATE INDEX idx_simulations_started_at ON simulations(started_at DESC);

-- Índices para user_preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Índices para market_snapshots
CREATE INDEX idx_market_snapshots_room_id ON market_snapshots(room_id);
CREATE INDEX idx_market_snapshots_symbol ON market_snapshots(symbol);
CREATE INDEX idx_market_snapshots_timestamp ON market_snapshots(timestamp DESC);
-- Índice compuesto para consultas por sala y símbolo
CREATE INDEX idx_market_snapshots_room_symbol ON market_snapshots(room_id, symbol, timestamp DESC);
```

---

## Paso 8: Crear Triggers y Funciones Auxiliares 🔧

Los triggers automatizan tareas cuando ocurren eventos en la base de datos.

### 8.1 Función: Actualizar `updated_at` automáticamente

```sql
-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a la tabla users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar a la tabla user_preferences
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 8.2 Trigger: Actualizar `student_count` automáticamente

```sql
-- Función para incrementar student_count al unirse a una sala
CREATE OR REPLACE FUNCTION increment_student_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rooms
    SET student_count = student_count + 1
    WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para decrementar student_count al salir de una sala
CREATE OR REPLACE FUNCTION decrement_student_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rooms
    SET student_count = student_count - 1
    WHERE id = OLD.room_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger al insertar en room_members
CREATE TRIGGER increment_room_student_count
    AFTER INSERT ON room_members
    FOR EACH ROW
    EXECUTE FUNCTION increment_student_count();

-- Trigger al eliminar de room_members
CREATE TRIGGER decrement_room_student_count
    AFTER DELETE ON room_members
    FOR EACH ROW
    EXECUTE FUNCTION decrement_student_count();
```

### 8.3 Trigger: Crear preferencias automáticamente para nuevos usuarios

```sql
-- Función para crear preferencias por defecto
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger al crear un usuario
CREATE TRIGGER create_user_preferences
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_preferences();
```

### 8.4 Función: Calcular ganancia/pérdida en transacciones

```sql
-- Función para calcular profit/loss al vender
CREATE OR REPLACE FUNCTION calculate_profit_loss()
RETURNS TRIGGER AS $$
DECLARE
    avg_entry_price DECIMAL;
BEGIN
    IF NEW.type = 'sell' THEN
        -- Obtener precio promedio de compra del mismo símbolo
        SELECT AVG(price) INTO avg_entry_price
        FROM transactions
        WHERE user_id = NEW.user_id
        AND room_id = NEW.room_id
        AND symbol = NEW.symbol
        AND type = 'buy'
        AND created_at < NEW.created_at;
        
        IF avg_entry_price IS NOT NULL THEN
            NEW.profit_loss = (NEW.price - avg_entry_price) * NEW.quantity;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger al insertar transacción
CREATE TRIGGER calculate_transaction_profit_loss
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_profit_loss();
```

### 8.5 Función: Desactivar alarmas automáticamente cuando se activan

```sql
-- Función para desactivar alarma al activarse
CREATE OR REPLACE FUNCTION deactivate_triggered_alarm()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.triggered = true AND OLD.triggered = false THEN
        NEW.is_active = false;
        NEW.triggered_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger al actualizar price_alarms
CREATE TRIGGER deactivate_alarm_on_trigger
    BEFORE UPDATE ON price_alarms
    FOR EACH ROW
    EXECUTE FUNCTION deactivate_triggered_alarm();
```

### 8.6 Función Auxiliar: Obtener balance de un usuario

```sql
-- Función para calcular balance real de un usuario en una sala
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id UUID, p_room_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    initial_balance DECIMAL;
    total_spent DECIMAL;
    total_earned DECIMAL;
    current_balance DECIMAL;
BEGIN
    -- Balance inicial del usuario
    SELECT balance INTO initial_balance FROM users WHERE id = p_user_id;
    
    -- Total gastado en compras
    SELECT COALESCE(SUM(total), 0) INTO total_spent
    FROM transactions
    WHERE user_id = p_user_id AND room_id = p_room_id AND type = 'buy';
    
    -- Total ganado en ventas
    SELECT COALESCE(SUM(total), 0) INTO total_earned
    FROM transactions
    WHERE user_id = p_user_id AND room_id = p_room_id AND type = 'sell';
    
    -- Balance actual = inicial - gastado + ganado
    current_balance = initial_balance - total_spent + total_earned;
    
    RETURN current_balance;
END;
$$ LANGUAGE plpgsql;
```

### 8.7 Vista: Portafolio en tiempo real

```sql
-- Vista para ver el portafolio actual de cada usuario
CREATE OR REPLACE VIEW user_portfolios AS
SELECT 
    p.user_id,
    p.room_id,
    p.symbol,
    SUM(p.quantity) as total_quantity,
    AVG(p.entry_price) as avg_entry_price,
    MAX(p.current_price) as current_price,
    SUM(p.quantity * p.entry_price) as total_invested,
    SUM(p.quantity * COALESCE(p.current_price, p.entry_price)) as current_value,
    SUM(p.quantity * (COALESCE(p.current_price, p.entry_price) - p.entry_price)) as unrealized_pnl
FROM positions p
WHERE p.closed_at IS NULL
GROUP BY p.user_id, p.room_id, p.symbol;
```

---

## Paso 9: Script SQL Completo - Copiar y Pegar ⚡

**¡Todo en uno!** Copia y pega este script completo en el SQL Editor de Supabase para crear todo de una vez:

```sql
-- =====================================================
-- GLOBALLABTRADING - SCRIPT COMPLETO DE BASE DE DATOS
-- =====================================================
-- Este script crea todas las tablas, índices, triggers,
-- funciones y políticas RLS necesarias para el proyecto.
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PASO 1: CREAR TABLAS
-- =====================================================

-- Tabla: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  balance DECIMAL DEFAULT 10000.00 NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  student_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: room_members
CREATE TABLE room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  UNIQUE(room_id, user_id)
);

-- Tabla: positions
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('long', 'short')),
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  entry_price DECIMAL NOT NULL CHECK (entry_price > 0),
  current_price DECIMAL,
  stop_loss DECIMAL CHECK (stop_loss > 0),
  take_profit DECIMAL CHECK (take_profit > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla: transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  symbol TEXT NOT NULL,
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  price DECIMAL NOT NULL CHECK (price > 0),
  total DECIMAL NOT NULL,
  fee DECIMAL DEFAULT 0,
  profit_loss DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: pending_orders
CREATE TABLE pending_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('limit', 'stop_loss', 'take_profit')),
  quantity DECIMAL NOT NULL CHECK (quantity > 0),
  trigger_price DECIMAL NOT NULL CHECK (trigger_price > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled', 'expired')),
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  execution_price DECIMAL,
  executed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: price_alarms
CREATE TABLE price_alarms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  price DECIMAL NOT NULL CHECK (price > 0),
  triggered BOOLEAN DEFAULT false NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('student_trade', 'order_executed', 'alarm_triggered', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: simulations
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  simulation_type TEXT NOT NULL CHECK (simulation_type IN ('crisis_2007', 'ww2', '9_11', 'elections', 'custom')),
  duration INTEGER NOT NULL,
  volatility_multiplier DECIMAL DEFAULT 1.0,
  trend_multiplier DECIMAL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: user_preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'hi')),
  chart_type TEXT DEFAULT 'candlestick' CHECK (chart_type IN ('candlestick', 'line', 'area')),
  chart_interval TEXT DEFAULT '15m' CHECK (chart_interval IN ('1m', '5m', '15m', '1h', '4h', '1d')),
  show_indicators JSONB DEFAULT '[]'::jsonb,
  notifications_enabled BOOLEAN DEFAULT true NOT NULL,
  sound_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabla: market_snapshots
CREATE TABLE market_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  open DECIMAL NOT NULL,
  high DECIMAL NOT NULL,
  low DECIMAL NOT NULL,
  close DECIMAL NOT NULL,
  volume DECIMAL DEFAULT 0,
  simulation_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- PASO 2: CREAR ÍNDICES
-- =====================================================

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Índices para rooms
CREATE INDEX idx_rooms_owner_id ON rooms(owner_id);
CREATE INDEX idx_rooms_class_code ON rooms(class_code);
CREATE INDEX idx_rooms_is_active ON rooms(is_active);

-- Índices para room_members
CREATE INDEX idx_room_members_room_id ON room_members(room_id);
CREATE INDEX idx_room_members_user_id ON room_members(user_id);
CREATE INDEX idx_room_members_active ON room_members(is_active);

-- Índices para positions
CREATE INDEX idx_positions_user_id ON positions(user_id);
CREATE INDEX idx_positions_room_id ON positions(room_id);
CREATE INDEX idx_positions_symbol ON positions(symbol);
CREATE INDEX idx_positions_closed_at ON positions(closed_at);
CREATE INDEX idx_positions_open ON positions(user_id, room_id) WHERE closed_at IS NULL;

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_room_id ON transactions(room_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Índices para pending_orders
CREATE INDEX idx_pending_orders_user_id ON pending_orders(user_id);
CREATE INDEX idx_pending_orders_room_id ON pending_orders(room_id);
CREATE INDEX idx_pending_orders_symbol ON pending_orders(symbol);
CREATE INDEX idx_pending_orders_status ON pending_orders(status);
CREATE INDEX idx_pending_orders_active ON pending_orders(room_id, symbol, status) WHERE status = 'pending';

-- Índices para price_alarms
CREATE INDEX idx_price_alarms_user_id ON price_alarms(user_id);
CREATE INDEX idx_price_alarms_room_id ON price_alarms(room_id);
CREATE INDEX idx_price_alarms_symbol ON price_alarms(symbol);
CREATE INDEX idx_price_alarms_active ON price_alarms(is_active) WHERE is_active = true;

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_room_id ON notifications(room_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE read = false;

-- Índices para simulations
CREATE INDEX idx_simulations_room_id ON simulations(room_id);
CREATE INDEX idx_simulations_teacher_id ON simulations(teacher_id);
CREATE INDEX idx_simulations_type ON simulations(simulation_type);
CREATE INDEX idx_simulations_started_at ON simulations(started_at DESC);

-- Índices para user_preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Índices para market_snapshots
CREATE INDEX idx_market_snapshots_room_id ON market_snapshots(room_id);
CREATE INDEX idx_market_snapshots_symbol ON market_snapshots(symbol);
CREATE INDEX idx_market_snapshots_timestamp ON market_snapshots(timestamp DESC);
CREATE INDEX idx_market_snapshots_room_symbol ON market_snapshots(room_id, symbol, timestamp DESC);

-- =====================================================
-- PASO 3: CREAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar student_count
CREATE OR REPLACE FUNCTION increment_student_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rooms SET student_count = student_count + 1 WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para decrementar student_count
CREATE OR REPLACE FUNCTION decrement_student_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rooms SET student_count = student_count - 1 WHERE id = OLD.room_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers para student_count
CREATE TRIGGER increment_room_student_count
    AFTER INSERT ON room_members
    FOR EACH ROW
    EXECUTE FUNCTION increment_student_count();

CREATE TRIGGER decrement_room_student_count
    AFTER DELETE ON room_members
    FOR EACH ROW
    EXECUTE FUNCTION decrement_student_count();

-- Función para crear preferencias por defecto
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear preferencias
CREATE TRIGGER create_user_preferences
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_preferences();

-- Función para calcular profit/loss
CREATE OR REPLACE FUNCTION calculate_profit_loss()
RETURNS TRIGGER AS $$
DECLARE
    avg_entry_price DECIMAL;
BEGIN
    IF NEW.type = 'sell' THEN
        SELECT AVG(price) INTO avg_entry_price
        FROM transactions
        WHERE user_id = NEW.user_id AND room_id = NEW.room_id
        AND symbol = NEW.symbol AND type = 'buy' AND created_at < NEW.created_at;
        
        IF avg_entry_price IS NOT NULL THEN
            NEW.profit_loss = (NEW.price - avg_entry_price) * NEW.quantity;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profit/loss
CREATE TRIGGER calculate_transaction_profit_loss
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_profit_loss();

-- Función para desactivar alarmas
CREATE OR REPLACE FUNCTION deactivate_triggered_alarm()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.triggered = true AND OLD.triggered = false THEN
        NEW.is_active = false;
        NEW.triggered_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para alarmas
CREATE TRIGGER deactivate_alarm_on_trigger
    BEFORE UPDATE ON price_alarms
    FOR EACH ROW
    EXECUTE FUNCTION deactivate_triggered_alarm();

-- Función auxiliar: obtener balance
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id UUID, p_room_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    initial_balance DECIMAL;
    total_spent DECIMAL;
    total_earned DECIMAL;
BEGIN
    SELECT balance INTO initial_balance FROM users WHERE id = p_user_id;
    SELECT COALESCE(SUM(total), 0) INTO total_spent
    FROM transactions WHERE user_id = p_user_id AND room_id = p_room_id AND type = 'buy';
    SELECT COALESCE(SUM(total), 0) INTO total_earned
    FROM transactions WHERE user_id = p_user_id AND room_id = p_room_id AND type = 'sell';
    RETURN initial_balance - total_spent + total_earned;
END;
$$ LANGUAGE plpgsql;

-- Vista: portafolios de usuarios
CREATE OR REPLACE VIEW user_portfolios AS
SELECT 
    p.user_id, p.room_id, p.symbol,
    SUM(p.quantity) as total_quantity,
    AVG(p.entry_price) as avg_entry_price,
    MAX(p.current_price) as current_price,
    SUM(p.quantity * p.entry_price) as total_invested,
    SUM(p.quantity * COALESCE(p.current_price, p.entry_price)) as current_value,
    SUM(p.quantity * (COALESCE(p.current_price, p.entry_price) - p.entry_price)) as unrealized_pnl
FROM positions p
WHERE p.closed_at IS NULL
GROUP BY p.user_id, p.room_id, p.symbol;

-- =====================================================
-- ¡TABLAS, ÍNDICES, FUNCIONES Y TRIGGERS CREADOS!
-- Ahora configura RLS manualmente en el paso siguiente
-- =====================================================
```

> **⚠️ IMPORTANTE**: El script anterior NO incluye las políticas de RLS por seguridad. Debes configurar las políticas manualmente desde el panel de Supabase siguiendo el **Paso 6**.

---

## Paso 10: Instalar el Cliente de Supabase

En tu proyecto de Replit, ejecuta:

```bash
npm install @supabase/supabase-js
```

## Paso 11: Configurar el Cliente de Supabase

Crea un archivo `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Paso 12: Ejemplos de Uso

### Autenticación

```javascript
// Registro
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      username: username,
      name: name,
      role: role
    }
  }
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
})

// Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser()

// Logout
await supabase.auth.signOut()
```

### Operaciones CRUD

```javascript
// Crear sala
const { data, error } = await supabase
  .from('rooms')
  .insert({
    name: roomName,
    class_code: generatedCode,
    owner_id: user.id,
    description: description
  })
  .select()
  .single()

// Unirse a sala
await supabase
  .from('room_members')
  .insert({
    room_id: roomId,
    user_id: user.id
  })

// Crear posición
await supabase
  .from('positions')
  .insert({
    user_id: user.id,
    room_id: roomId,
    symbol: 'BTCUSD',
    type: 'long',
    quantity: 0.5,
    entry_price: 45000,
    current_price: 45000
  })

// Crear orden pendiente
await supabase
  .from('pending_orders')
  .insert({
    user_id: user.id,
    room_id: roomId,
    symbol: 'AAPL',
    side: 'buy',
    order_type: 'limit',
    quantity: 10,
    trigger_price: 175.00
  })

// Crear alarma de precio
await supabase
  .from('price_alarms')
  .insert({
    user_id: user.id,
    room_id: roomId,
    symbol: 'ETHUSD',
    condition: 'above',
    price: 3000
  })

// Obtener notificaciones no leídas
const { data: notifications } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', user.id)
  .eq('read', false)
  .order('created_at', { ascending: false })
```

### Tiempo Real

```javascript
// Escuchar cambios en posiciones
const positionsChannel = supabase
  .channel('positions_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'positions', filter: `room_id=eq.${roomId}` }, 
    (payload) => {
      console.log('Posición cambió:', payload)
      // Actualizar estado
    }
  )
  .subscribe()

// Escuchar nuevas notificaciones
const notificationsChannel = supabase
  .channel('notifications_changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
    (payload) => {
      console.log('Nueva notificación:', payload.new)
      // Mostrar toast
    }
  )
  .subscribe()

// Limpiar subscripción
supabase.removeChannel(positionsChannel)
```

## Paso 13: Testing

1. Reinicia tu aplicación en Replit
2. Registra un nuevo usuario
3. Verifica en Supabase → **Table Editor** que aparece en `users` y `user_preferences`
4. Crea una sala como profesor y verifica que aparece en `rooms`
5. Únete a la sala como estudiante y verifica `room_members` y `student_count`
6. Realiza una operación y verifica `positions` y `transactions`
7. Crea una alarma y verifica `price_alarms`

## Recursos Adicionales

- 📚 [Documentación de Supabase](https://supabase.com/docs)
- 🎓 [Tutorial de Autenticación](https://supabase.com/docs/guides/auth)
- ⚡ [Realtime con Supabase](https://supabase.com/docs/guides/realtime)
- 💬 [Comunidad de Supabase](https://discord.supabase.com)

## Preguntas Frecuentes

**P: ¿Cuánto cuesta Supabase?**  
R: El plan gratuito incluye 500MB de base de datos, 1GB de almacenamiento y 2GB de ancho de banda. Suficiente para desarrollo y proyectos pequeños.

**P: ¿Puedo migrar mis datos de localStorage a Supabase?**  
R: Sí, puedes crear un script de migración que lea los datos de localStorage y los inserte en Supabase.

**P: ¿Es seguro?**  
R: Sí, Supabase usa encriptación y RLS para proteger tus datos. Asegúrate de configurar las políticas correctamente.

**P: ¿Funciona sin conexión?**  
R: No por defecto, pero puedes implementar un sistema de caché con Service Workers.

---

**¿Necesitas ayuda?** Si tienes problemas con la migración, puedes:
1. Revisar los logs en Supabase Dashboard
2. Verificar que las variables de entorno estén correctas
3. Consultar la documentación oficial
