# ConcretoPro Web App

Aplicación web completa para negocio de adobes, prefabricados y mobiliario en concreto.

## Características

- **Landing Page**: Diseño moderno, responsivo y optimizado para conversión.
- **Smart Chat**: Chatbot con lógica condicional que cualifica leads y detecta urgencia automáticamente.
- **Dashboard Administrativo**: Panel protegido para gestionar leads, filtrar por estado y ver estadísticas.
- **Sistema de Agendamiento**: Calendario integrado para reservas de citas técnicas.
- **Integración con Supabase**: Base de datos nativa y autenticación lista para usar.

## Configuración de Supabase

Para que la aplicación funcione correctamente, debes crear una tabla en Supabase con el siguiente esquema SQL:

```sql
create table leads (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text,
  phone text,
  product text,
  scale text,
  urgency text,
  priority text,
  status text default 'New',
  created_at timestamp with time zone default now()
);
```

Luego, configura las variables de entorno en un archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anon_de_supabase
```

## Ejecución Local

1. Instalar dependencias: `npm install`
2. Ejecutar en desarrollo: `npm run dev`
3. Abrir [http://localhost:3000](http://localhost:3000)

## despliegue

La aplicación está lista para ser desplegada en **Vercel** o cualquier plataforma compatible con Next.js.
