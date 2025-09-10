import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, type Student } from '@/lib/supabase'

export const useStudentsSupabaseStore = defineStore('students-supabase', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const studentsById = computed(() => {
    return students.value.reduce((acc, student) => {
      acc[student.id] = student
      return acc
    }, {} as Record<string, Student>)
  })

  async function fetchStudents() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      students.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch students'
      console.error('Error fetching students:', err)
    } finally {
      loading.value = false
    }
  }

  async function addStudent(firstName: string, lastName: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('students')
        .insert([{ first_name: firstName, last_name: lastName }])
        .select()
        .single()

      if (insertError) throw insertError
      students.value.unshift(data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add student'
      console.error('Error adding student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStudent(id: string, firstName: string, lastName: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('students')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update student'
      console.error('Error updating student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeStudent(id: string) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      students.value = students.value.filter(s => s.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove student'
      console.error('Error removing student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    students: computed(() => students.value),
    studentsById,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchStudents,
    addStudent,
    updateStudent,
    removeStudent
  }
})
