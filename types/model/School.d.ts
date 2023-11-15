declare namespace Model {
   namespace School {
      type Type = {
         id: number
         name: string
         created_at?: string | null
         updated_at?: string | null
      }

      type Student = {
         id: number
         school_id: number
         grade: number
         religion_id: number
         year: string
         count: number
         created_at?: string | null
         updated_at?: string | null
         religion?: Util.Religion
      }

      type Teacher = {
         id: number
         school_id: number
         year: string
         subject_id: number
         count: number
         created_at?: string | null
         updated_at?: string | null
         subject?: Util.Subject
      }
   }
}