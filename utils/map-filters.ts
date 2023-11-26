export const mapFilters = async (from: any, to: any) : Promise <any> => {
   return new Promise(resolve => {
      const result = to
      for (const [key, value] of Object.entries(from)) {
         result[key] = value
      }
      resolve(result)
   })
}