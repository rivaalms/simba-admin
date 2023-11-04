declare namespace API {
   namespace Request {
      type Login = {
         email: string
         password: string
      }

      type Data = {
         page?: number
         per_page?: number
         school?: number
      }
   }
}