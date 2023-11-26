declare namespace API {
   namespace Request {
      type Login = {
         email: string
         password: string
      }

      namespace Query {
         type Data = {
            school?: number | string | null
            year?: string | null
            category?: number | string | null
            type?: number | string | null
            status?: number | string | null
            per_page?: number | string | null
            page?: number | string | null
            [key: string]: number | string | null
         }

         type School = {
            type?: number | null
            supervisor?: number | null
            page?: number | string | null
            per_page?: number | string | null
            search?: string | null
            [key: string]: number | string | null
         }

         type Supervisor = {
            page?: number | string | null
            per_page?: number | string | null
            search?: string | null
            [key: string]: number | string | null
         }

         type Officer = API.Request.Query.Supervisor

         type SchoolStudent = {
            school_id: string | number | null
            year: string | null
            [key: string]: number | string | null
         }

         type SchoolTeacher = SchoolStudent
      }

      namespace Form {
         type Data = {
            school_id: number | string | null
            year: string | null
            data_type_id: number | string | null
            data_status_id: number | string | null
            file: File | Blob | null
            [key?: string]: string | number | Blob | null
         }

         type School = {
            school_type_id: number | null
            supervisor_id: number | null
            principal: string | null
            address: string | null
            name: string | null
            email: string | null
            password: string | null
            [key?: string] : string | number | null
         }

         type Supervisor = {
            name: string | null
            employee_number: string | null
            email: string | null
            password: string | null
            [key?: string]: string | number | null
         }

         type Officer = API.Request.Form.Supervisor

         type DataCategory = {
            name: string | null
            [key?: string]: string | number | null
         }

         type DataType = {
            name: string | null
            data_category_id: number | null
            [key?: string]: string | number | null
         }
      }
   }
}