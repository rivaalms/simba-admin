export const mapFilters = async (from: any, to: any) : Promise <any> => {
   const result = { ...to, ...from }
   return Promise.resolve(result)
}