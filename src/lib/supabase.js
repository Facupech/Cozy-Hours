import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Ayudantes de autenticación
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Ayudantes de perfil de usuario
export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: userId,
        ...profileData
      }
    ])
    .select()
  return { data, error }
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
  return { data, error }
}

// Ayudantes de escritorio
export const createDesktop = async (desktopData) => {
  const { data, error } = await supabase
    .from('desktops')
    .insert([desktopData])
    .select()
  return { data, error }
}

export const getUserDesktops = async (userId) => {
  const { data, error } = await supabase
    .from('desktops')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getDesktopById = async (desktopId) => {
  const { data, error } = await supabase
    .from('desktops')
    .select('*')
    .eq('id', desktopId)
    .single()
  return { data, error }
}

export const updateDesktop = async (desktopId, updates) => {
  const { data, error } = await supabase
    .from('desktops')
    .update(updates)
    .eq('id', desktopId)
    .select()
  return { data, error }
}

export const deleteDesktop = async (desktopId) => {
  const { error } = await supabase
    .from('desktops')
    .delete()
    .eq('id', desktopId)
  return { error }
}

// Ayudantes de notas
export const createNote = async (noteData) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([noteData])
    .select()
  return { data, error }
}

export const getDesktopNotes = async (desktopId) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('desktop_id', desktopId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const updateNote = async (noteId, updates) => {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .select()
  return { data, error }
}

export const deleteNote = async (noteId) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
  return { error }
}

// Ayudantes de tareas
export const createTask = async (taskData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
  return { data, error }
}

export const getDesktopTasks = async (desktopId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('desktop_id', desktopId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
  return { data, error }
}

export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
  return { error }
}
