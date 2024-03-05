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

         type SchoolStudentGrowth = Wildcard & {
            start_year: string
            end_year: string
         }

         type SchoolTeacher = SchoolStudent

         type SchoolTeacherGrowth = SchoolStudentGrowth

         type DataStatus = Wildcard & {
            search?: string | null
            page?: number | null
            per_page?: number | null
         }

         type DataCategory = Wildcard & {
            search?: string | null
            page?: number | null
            per_page?: number | null
         }

         type DataType = Wildcard & {
            search?: string | null
            category?: number | null
            per_page?: number
            page?: number
         }

         type SchoolType = Wildcard & {
            search?: string | null
         }

         type Subject = Wildcard & {
            search?: string | null
            page?: number | null
            per_page?: number | null
         }

         type Religion = API.Request.Query.Subject

         type Comment = {
            sort?: string | null
         }
      }

      namespace Form {
         type Data = Wildcard & {
            school_id: number | string | null
            year: string | null
            data_type_id: number | string | null
            data_status_id: number | string | null
         }

         type School = {
            school_type_id: number | null
            supervisor_id: number | null
            principal: string | null
            address: string | null
            name: string | null
            email: string | null
            password: string | null
            confirm_password: string | null
            status: string | null
         }

         type Supervisor = {
            name: string | null
            employee_number: string | null
            email: string | null
            password: string | null
            confirm_password: string | null
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

         type Comment = {
            user_id: number | null
            data_id: number | null
            message: string | null
            reply_to: number | null
         }

         type SchoolStudent = {
            school_id: number | null
            year: string | null
            grade: number | null
            religion_id: number | null
            count: number | null
         }

         type SchoolTeachers = {
            school_id: number | null
            year: string | null
            subject_id: number | null
            count: number | null
         }

         type ForgotPassword = {
            email: string | null
         }

         type ResetPassword = {
            email: string | null
            password: string | null
            password_confirmation: string | null
            token: string | null
         }

         type CheckResetPasswordToken = {
            email: string | null
            token: string | null
         }
      }
   }
}