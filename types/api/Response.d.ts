declare namespace API {
   type Response <T> = {
      success: boolean
      message: string | null
      data: T
   }

   type Error = {
      response: {
         _data: API.Response <null>
      }
   }
}