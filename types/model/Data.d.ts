declare namespace Model {
   type Data = {
      id: number
      school_id: number
      data_type_id: number
      data_status_id: number
      path: string
      year: string
      created_at?: string | null
      updated_at?: string | null
      school: Model.School
      type: Model.Data.Type
      status: Model.DataStatus
   }

   namespace Data {
      type Status = {
         id: number
         name: string
         created_at?: string | null
         updated_at?: string | null
      }

      type Type = {
         id: number
         name: string
         slug: string
         data_category_id: number
         category?: Model.DataCategory
         created_at?: string | null
         updated_at?: string | null
      }

      type Category = {
         id: number
         name: string
         slug: string
         created_at?: string | null
         updated_at?: string | null
      }
   }

   type Redraft = {
      id: number
      user_id: number
      data_id: number
      message: string
      created_at?: string | null
      updated_at?: string | null
   }
}