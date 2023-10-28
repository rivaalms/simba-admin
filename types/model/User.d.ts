declare namespace Model {
   type User = {
      id: number
      name: string
      email: string
      userable_type: string | null
      userable_id: number | null
      created_at?: string | null
      updated_at?: string | null
   }
}