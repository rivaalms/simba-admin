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
         type Data = Wildcard & {
            school?: number | string | null
            year?: string | null
            category?: number | string | null
            type?: number | string | null
            status?: number | string | null
            per_page?: number | string | null
            page?: number | string | null
         }

         type School = Wildcard & {
            type?: number | null
            supervisor?: number | null
            page?: number | string | null
            per_page?: number | string | null
            search?: string | null
         }

         type Supervisor = Wildcard & {
            page?: number | string | null
            per_page?: number | string | null
            search?: string | null
         }

         type Officer = API.Request.Query.Supervisor

         type SchoolStudent = Wildcard & {
            school_id: string | number | null
            year: string | null
         }

         type SchoolTeacher = SchoolStudent

         type SchoolType = Wildcard & {
            search?: string | null
         }

         type Subject = Wildcard & {
            search?: string | null
            page?: number | null
            per_page?: number | null
         }

         type Religion = API.Request.Query.Subject
      }

      namespace Form {
         type Data = {
            school_id: number | string | null
            year: string | null
            data_type_id: number | string | null
            data_status_id: number | string | null
            file: File | Blob | null
         }

         type School = {
            school_type_id: number | null
            supervisor_id: number | null
            principal: string | null
            address: string | null
            name: string | null
            email: string | null
            password: string | null
         }

         type Supervisor = {
            name: string | null
            employee_number: string | null
            email: string | null
            password: string | null
         }

         type Officer = API.Request.Form.Supervisor

         type DataStatus = {
            name: string | null
         }

         type DataCategory = {
            name: string | null
         }

         type DataType = {
            name: string | null
            data_category_id: number | null
         }

         type SchoolType = {
            name: string | null
         }

         type Subject = {
            name: string | null
            abbreviation: string | null
         }

         type Religion = {
            name: string | null
         }
      }
   }
}