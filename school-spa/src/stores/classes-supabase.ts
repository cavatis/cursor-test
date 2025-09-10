import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, type Class, type ClassStudent } from '@/lib/supabase'
import { useStudentsSupabaseStore } from './students-supabase'

export const useClassesSupabaseStore = defineStore('classes-supabase', () => {
  const classes = ref<Class[]>([])
  const classStudents = ref<ClassStudent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const studentsStore = useStudentsSupabaseStore()

  const classesById = computed(() => {
    return classes.value.reduce((acc, klass) => {
      acc[klass.id] = klass
      return acc
    }, {} as Record<string, Class>)
  })

  const classesWithCounts = computed(() => {
    return classes.value.map(klass => ({
      ...klass,
      count: classStudents.value.filter(cs => cs.class_id === klass.id).length
    }))
  })

  async function fetchClasses() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      classes.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch classes'
      console.error('Error fetching classes:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchClassStudents() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('class_students')
        .select('*')

      if (fetchError) throw fetchError
      classStudents.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch class students'
      console.error('Error fetching class students:', err)
    } finally {
      loading.value = false
    }
  }

  async function addClass(name: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('classes')
        .insert([{ name }])
        .select()
        .single()

      if (insertError) throw insertError
      classes.value.unshift(data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add class'
      console.error('Error adding class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeClass(id: string) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      classes.value = classes.value.filter(c => c.id !== id)
      classStudents.value = classStudents.value.filter(cs => cs.class_id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove class'
      console.error('Error removing class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function assignStudentToClass(classId: string, studentId: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('class_students')
        .insert([{ class_id: classId, student_id: studentId }])
        .select()
        .single()

      if (insertError) throw insertError
      classStudents.value.push(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to assign student to class'
      console.error('Error assigning student to class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeStudentFromClass(classId: string, studentId: string) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('class_students')
        .delete()
        .eq('class_id', classId)
        .eq('student_id', studentId)

      if (deleteError) throw deleteError
      classStudents.value = classStudents.value.filter(
        cs => !(cs.class_id === classId && cs.student_id === studentId)
      )
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove student from class'
      console.error('Error removing student from class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function getClassStudents(classId: string) {
    const studentIds = classStudents.value
      .filter(cs => cs.class_id === classId)
      .map(cs => cs.student_id)
    
    return studentsStore.students.filter((student: any) => 
      studentIds.includes(student.id)
    )
  }

  return {
    classes: computed(() => classes.value),
    classesById,
    classesWithCounts,
    classStudents: computed(() => classStudents.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchClasses,
    fetchClassStudents,
    addClass,
    removeClass,
    assignStudentToClass,
    removeStudentFromClass,
    getClassStudents
  }
})
