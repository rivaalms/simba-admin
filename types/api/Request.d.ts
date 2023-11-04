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
      }
   }
}