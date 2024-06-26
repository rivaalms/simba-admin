declare namespace Util {
   type Router = {
      label: string
      to?: string
      icon?: string
      children?: Util.Router[]
   }

   type LaravelPagination <T> = {
      current_page: number
      data: T
      first_page_url: string | null
      from: number | null
      last_page: number | null
      last_page_url: string | null
      links: Array<{
         url: string | null
         label: string
         active: boolean
      }>
      next_page_url: string | null
      path: string
      per_page: number
      prev_page_url: string | null
      to: number | null
      total: number
   }

   type TableColumns = {
      key: string
      label: string
      class?: string
   }

   type SelectOption = {
      label: string
      value: string | number | null
   }

   type Religion = {
      id: number
      name: string
      created_at?: string | null
      updated_at?: string | null
   }

   type Subject = {
      id: number
      name: string
      abbreviation: string
      created_at?: string | null
      updated_at?: string | null
   }

   type MapStudent = {
      grade: number
      islam: number
      katolik: number
      kristen: number
      hindu: number
      buddha: number
      konghucu: number
      total: number
      year: string
   }

   type MapTeacher = {
      subject: string
      value: string | number
   }

   type StudentGrowth = {
      year: string
      total: number
   }

   type TeacherGrowth = StudentGrowth

   type DataCountItem = {
      name: string
      count: number
   }

   type DataCount = {
      total: number
      data_by_status: DataCountItem[]
      data_by_category: (DataCountItem & {
         data_by_type: DataCountItem[]
      })[]
      start_year: string
      end_year: string
   }

   type UserCount = {
      total: number
      user_by_type: {
         school: number
         supervisor: number
         officer: number
         admin: number
      }
   }
}