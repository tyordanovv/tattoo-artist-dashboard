import { createClient } from "./supabaseClient"
import { Design, User } from "./types"

// User related API calls
export const getUserSession = async () => {
  const supabase = createClient()
  return await supabase.auth.getSession()
}

export const getUserData = async (userId: string): Promise<User | null> => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getUserData:', error)
    return null
  }
}

// Project/Design related API calls
export const getProjects = async (userId: string, userRole: string): Promise<Design[]> => {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('designs')
      .select(`
        id, client_id, status, image_url, version, created_at, isSelected, scheduled_at,
        users!designs_client_id_fkey (name)
      `)
      .eq('isSelected', true)
    
    // Apply filter based on user role
    if (userRole === 'client') {
      query = query.eq('client_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    return (data || []).map((item) => ({
      id: item.id,
      clientId: item.client_id,
      clientName: (item.users as any).name,
      status: item.status,
      imageUrl: item.image_url,
      version: item.version,
      createdAt: item.created_at,
      isSelected: item.isSelected,
      scheduledAt: item.scheduled_at
    }))
  } catch (error) {
    console.error('Error in getProjects:', error)
    return []
  }
}

export const getProjectById = async (projectId: string): Promise<Design | null> => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('designs')
      .select(`
        id, client_id, status, image_url, version, created_at, isSelected, scheduled_at,
        users!designs_client_id_fkey (name)
      `)
      .eq('id', projectId)
      .single()
    
    if (error) {
      throw error
    }
    
    if (!data) {
      return null
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      clientName: (data.users as any).name,
      status: data.status,
      imageUrl: data.image_url,
      version: data.version,
      createdAt: data.created_at,
      isSelected: data.isSelected,
      scheduledAt: data.scheduled_at
    }
  } catch (error) {
    console.error('Error in getProjectById:', error)
    return null
  }
}

// Comment related API calls
// export const getComments = async (projectId: string): Promise<Comment[]> => {
//   const supabase = createClient()
  
//   try {
//     const { data, error } = await supabase
//       .from('comments')
//       .select(`
//         id, content, created_at, project_id, user_id,
//         users (name, role)
//       `)
//       .eq('project_id', projectId)
//       .order('created_at', { ascending: true })
    
//     if (error) {
//       throw error
//     }
    
//     return (data || []).map((item) => ({
//       id: item.id,
//       content: item.content,
//       createdAt: item.created_at,
//       projectId: item.project_id,
//       userId: item.user_id,
//       userName: item.users.name,
//       userRole: item.users.role,
//     }))
//   } catch (error) {
//     console.error('Error in getComments:', error)
//     return []
//   }
// }

// export const postComment = async (designId: string, content: string, userId: string): Promise<Comment | null> => {
//   const supabase = createClient()
  
//   try {
//     const { data, error } = await supabase
//       .from('comments')
//       .insert([
//         { 
//           design_id: designId, 
//           content, 
//           user_id: userId 
//         }
//       ])
//       .select(`
//         id, content, created_at, design_id, user_id,
//         users (name, role)
//       `)
//       .single()
    
//     if (error) {
//       throw error
//     }
    
//     if (!data) {
//       return null
//     }
    
//     return {
//       id: data.id,
//       content: data.content,
//       createdAt: data.created_at,
//       designId: data.design_id,
//       userId: data.user_id,
//       userName: data.users.name,
//       userRole: data.users.role,
//     }
//   } catch (error) {
//     console.error('Error in postComment:', error)
//     return null
//   }
// }

// Version related API calls
// export const getVersions = async (projectId: string): Promise<Version[]> => {
//   const supabase = createClient()
  
//   try {
//     const { data, error } = await supabase
//       .from('designs')
//       .select(`
//         id, version, image_url, created_at, status, isSelected
//       `)
//       .eq('client_id', (await getProjectById(projectId))?.clientId)
//       .order('version', { ascending: false })
    
//     if (error) {
//       throw error
//     }
    
//     return (data || []).map((item) => ({
//       id: item.id,
//       version: item.version,
//       imageUrl: item.image_url,
//       createdAt: item.created_at,
//       status: item.status,
//       isSelected: item.isSelected,
//     }))
//   } catch (error) {
//     console.error('Error in getVersions:', error)
//     return []
//   }
// }

// Project status update
export const updateDesignSchedule = async (designId: string, fullDateTime: string): Promise<boolean> => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('designs')
      .update({ 'scheduled_at': fullDateTime })
      .eq('id', designId)
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Error in updateProjectStatus:', error)
    return false
  }
}

// Authentication helpers
export const checkAndRedirect = async () => {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { authenticated: false, user: null }
  }
  
  const userData = await getUserData(session.user.id)
  
  if (!userData) {
    return { authenticated: false, user: null }
  }
  
  return { authenticated: true, user: userData }
}