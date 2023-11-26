type Wildcard = {
   [key?: string]: any
}

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
         }

         type School = {
            type?: number | null
            supervisor?: number | null
            page?: number | string | null
            per_page?: number | string | null
            search?: string | null
         }

         type Supervisor = {
            page?: number | string | null
            per_page?: number | string | null
            search?: string | null
         }

         type Officer = API.Request.Query.Supervisor

         type SchoolStudent = {
            school_id: string | number | null
            year: string | null
         }

         type SchoolTeacher = SchoolStudent

         type SchoolType = {
            search?: string | null
         }
      }

      namespace Form {
         type Data = Wildcard & {
            school_id: number | string | null
            year: string | null
            data_type_id: number | string | null
            data_status_id: number | string | null
            file: File | Blob | null
         }

         type School = Wildcard & {
            school_type_id: number | null
            supervisor_id: number | null
            principal: string | null
            address: string | null
            name: string | null
            email: string | null
            password: string | null
         }

         type Supervisor = Wildcard & {
            name: string | null
            employee_number: string | null
            email: string | null
            password: string | null
         }

         type Officer = API.Request.Form.Supervisor

         type DataStatus = Wildcard & {
            name: string | null
         }

         type DataCategory = Wildcard & {
            name: string | null
         }

         type DataType = Wildcard & {
            name: string | null
            data_category_id: number | null
         }

         type SchoolType = Wildcard & {
            name: string | null
         }
      }
   }
}