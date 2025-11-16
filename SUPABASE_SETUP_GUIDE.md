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

## Paso 5: Crear las Tablas de la Base de Datos

En Supabase, ve a **Table Editor** y crea estas tablas:

### Tabla: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  balance DECIMAL DEFAULT 10000,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: rooms

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: room_members

```sql
CREATE TABLE room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);
```

### Tabla: positions

```sql
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('long', 'short')),
  quantity DECIMAL NOT NULL,
  entry_price DECIMAL NOT NULL,
  current_price DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  symbol TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Paso 6: Instalar el Cliente de Supabase

En tu proyecto de Replit, ejecuta:

```bash
npm install @supabase/supabase-js
```

## Paso 7: Configurar el Cliente de Supabase

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

## Paso 8: Migrar la Lógica Actual

Actualmente, GlobalTradeLab usa `localStorage` para guardar datos. Necesitarás:

1. **Autenticación**: Reemplazar el login/registro actual con `supabase.auth`
2. **Salas**: Guardar rooms en la tabla `rooms` en vez de localStorage
3. **Usuarios**: Guardar usuarios en la tabla `users`
4. **Sincronización en Tiempo Real**: Usar Supabase Realtime para actualizaciones automáticas

### Ejemplo de Autenticación:

```javascript
// Registro
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      username: username,
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
```

### Ejemplo de Crear Sala:

```javascript
const { data, error } = await supabase
  .from('rooms')
  .insert({
    name: roomName,
    class_code: generatedCode,
    owner_id: user.id
  })
  .select()
  .single()
```

### Ejemplo de Tiempo Real:

```javascript
// Escuchar cambios en salas
const channel = supabase
  .channel('rooms')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'rooms' }, 
    (payload) => {
      console.log('Room cambió:', payload)
      // Actualizar estado
    }
  )
  .subscribe()
```

## Paso 9: Configurar Políticas de Seguridad (RLS)

En Supabase, ve a **Authentication** → **Policies** y habilita RLS (Row Level Security) para cada tabla.

Ejemplo para la tabla `rooms`:

```sql
-- Los profesores pueden crear salas
CREATE POLICY "Teachers can create rooms"
ON rooms FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = owner_id AND
  (SELECT role FROM users WHERE id = auth.uid()) = 'teacher'
);

-- Todos pueden ver salas
CREATE POLICY "Anyone can view rooms"
ON rooms FOR SELECT
TO authenticated
USING (true);

-- Solo el dueño puede eliminar su sala
CREATE POLICY "Owners can delete their rooms"
ON rooms FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);
```

## Paso 10: Testing

1. Reinicia tu aplicación en Replit
2. Prueba registrar un nuevo usuario
3. Verifica en Supabase que aparece en la tabla `users`
4. Prueba crear una sala y ver que se guarda en `rooms`

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
