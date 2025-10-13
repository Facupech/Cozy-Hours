--Configuración de la base de datos de Supabase para Cozy Hours
-- Ejecutar esta consulta SQL en el editor SQL de Supabase

-- Crear tipos personalizados
CREATE TYPE emotional_state AS ENUM (
  'happy',
  'calm',
  'focused',
  'energetic',
  'creative',
  'relaxed'
);

CREATE TYPE music_type AS ENUM (
  'lofi',
  'classical',
  'nature',
  'ambient',
  'jazz',
  'electronic'
);

-- =============================================
-- TABLA DE PERFILES DE USUARIO
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar SLR
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil." ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil." ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil." ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
--ESCRITORIOS
-- =============================================
CREATE TABLE IF NOT EXISTS desktops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  emotional_state emotional_state NOT NULL,
  theme_color TEXT DEFAULT '#667eea' CHECK (theme_color ~ '^#[0-9A-Fa-f]{6}$'),
  music_type music_type DEFAULT 'lofi',
  background_image TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar SLR
ALTER TABLE desktops ENABLE ROW LEVEL SECURITY;

-- Políticas para computadoras de escritorio
CREATE POLICY "Los usuarios pueden ver sus propios escritorios." ON desktops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios escritorios." ON desktops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios escritorios." ON desktops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios escritorios." ON desktops
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TABLA DE NOTAS
-- =============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  desktop_id UUID REFERENCES desktops(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Untitled Note',
  content TEXT NOT NULL CHECK (length(content) >= 1),
  color TEXT DEFAULT '#fbbf24' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 200 CHECK (width >= 100 AND width <= 500),
  height INTEGER DEFAULT 150 CHECK (height >= 100 AND height <= 400),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar SLR
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Políticas para notas
CREATE POLICY "Los usuarias pueden ver sus propias notas." ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propias notas" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias notas." ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias notas." ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TABLA DE TAREAS
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  desktop_id UUID REFERENCES desktops(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar SLR
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para tareas
CREATE POLICY "Los usuarios pueden ver sus propias tareas." ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear tareas propias." ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias tareas." ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar tareas propias " ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- MESA DE SESIONES POMODORO
-- =============================================
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  desktop_id UUID REFERENCES desktops(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('work', 'short_break', 'long_break')),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 120),
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar SLR
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Politicas para pomodoro_sessions
CREATE POLICY "Las usuarios pueden ver sus propias sesiones de pomodoro." ON pomodoro_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Las usuarios pueden crear sesiones de pomodoro propias." ON pomodoro_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias sesiones de pomodoro." ON pomodoro_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- TABLA DE CONFIGURACIÓN DEL USUARIO
-- =============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  music_volume INTEGER DEFAULT 70 CHECK (music_volume >= 0 AND music_volume <= 100),
  ambient_volume INTEGER DEFAULT 30 CHECK (ambient_volume >= 0 AND ambient_volume <= 100),
  notification_enabled BOOLEAN DEFAULT true,
  theme_preference TEXT DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  pomodoro_work_duration INTEGER DEFAULT 25 CHECK (pomodoro_work_duration >= 5 AND pomodoro_work_duration <= 60),
  pomodoro_short_break INTEGER DEFAULT 5 CHECK (pomodoro_short_break >= 1 AND pomodoro_short_break <= 15),
  pomodoro_long_break INTEGER DEFAULT 15 CHECK (pomodoro_long_break >= 10 AND pomodoro_long_break <= 30),
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar SLR
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para user_settings
CREATE POLICY "Los usuarios pueden ver su propia configuración" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propias configuraciones" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propia configuración" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- FUNCIONES Y DISPARADORES
-- =============================================

-- Función para actualizar la marca de tiempo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_desktops_updated_at BEFORE UPDATE ON desktops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear automáticamente el perfil de usuario y la configuración al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Desencadenante para el registro de nuevos usuarios
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para garantizar que solo haya un escritorio activo por usuario
CREATE OR REPLACE FUNCTION ensure_single_active_desktop()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE desktops 
    SET is_active = false 
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Disparador para la gestión activa de escritorios
CREATE TRIGGER ensure_single_active_desktop_trigger
  BEFORE INSERT OR UPDATE ON desktops
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_desktop();

-- Función para actualizar la marca de tiempo de finalización de la tarea
CREATE OR REPLACE FUNCTION update_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = true AND OLD.is_completed = false THEN
    NEW.completed_at = NOW();
  ELSIF NEW.is_completed = false AND OLD.is_completed = true THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Desencadenante para la finalización de la tarea
CREATE TRIGGER update_task_completion_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_task_completion();

-- =============================================
-- INDEXS DE DESEMPEÑO
-- =============================================

-- Indexs para consultas comunes
CREATE INDEX IF NOT EXISTS idx_desktops_user_id ON desktops(user_id);
CREATE INDEX IF NOT EXISTS idx_desktops_user_active ON desktops(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_notes_desktop_id ON notes(desktop_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_desktop_id ON tasks(desktop_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_pomodoro_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_desktop_id ON pomodoro_sessions(desktop_id);

-- =============================================
-- VISTAS PARA CONSULTAS COMUNES
-- =============================================

-- Ver estadísticas de escritorio
CREATE OR REPLACE VIEW desktop_stats AS
SELECT 
  d.id,
  d.name,
  d.user_id,
  d.emotional_state,
  d.is_active,
  COUNT(DISTINCT n.id) as notes_count,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.is_completed THEN t.id END) as completed_tasks,
  COUNT(DISTINCT ps.id) as pomodoro_sessions,
  d.created_at,
  d.updated_at
FROM desktops d
LEFT JOIN notes n ON d.id = n.desktop_id
LEFT JOIN tasks t ON d.id = t.desktop_id
LEFT JOIN pomodoro_sessions ps ON d.id = ps.desktop_id AND ps.completed = true
GROUP BY d.id, d.name, d.user_id, d.emotional_state, d.is_active, d.created_at, d.updated_at;

-- Ver estadísticas de productividad del usuario
CREATE OR REPLACE VIEW user_productivity_stats AS
SELECT 
  u.id as user_id,
  up.full_name,
  COUNT(DISTINCT d.id) as total_desktops,
  COUNT(DISTINCT n.id) as total_notes,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.is_completed THEN t.id END) as completed_tasks,
  COUNT(DISTINCT ps.id) as total_pomodoro_sessions,
  SUM(CASE WHEN ps.completed THEN ps.duration_minutes ELSE 0 END) as total_focus_minutes
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
LEFT JOIN desktops d ON u.id = d.user_id
LEFT JOIN notes n ON u.id = n.user_id
LEFT JOIN tasks t ON u.id = t.user_id
LEFT JOIN pomodoro_sessions ps ON u.id = ps.user_id
GROUP BY u.id, up.full_name;
