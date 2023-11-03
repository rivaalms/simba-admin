declare namespace Model {
   type User <T = Model.School | Model.Supervisor | Model.Officer | null> = {
      id: number
      name: string
      email: string
      userable_type: string | null
      userable_id: number | null
      created_at?: string | null
      updated_at?: string | null
      userable?: T
   }

   type School = {
      id: number
      school_type_id: number
      supervisor_id: number
      principal: string | null
      address: string | null
      created_at?: string | null
      updated_at?: string | null
      user?: Model.User
   }

   type Supervisor = {
      id: number
      employee_number: string
      created_at?: string | null
      updated_at?: string | null
      user?: Model.User
   }

   type Officer = Model.Supervisor
}