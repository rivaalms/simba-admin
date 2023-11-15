export const mapStudents = async (students: Model.School.Student[], religions: Util.Religion[]) : Promise<Util.MapStudent[]> => {
   const mapData = new Map()

   students.forEach(item => {
      const grade = item.grade
      const religionName = item.religion!.name.toLowerCase().replaceAll(' ', '_')
      const count = item.count
      const updatedAt = new Date(item.updated_at!).getTime()

      if (!mapData.has(grade)) {
         mapData.set(grade, {
            total: 0,
            latestUpdate: 0,
            religionData: {}
         })
      }

      if (!mapData.get(grade).religionData[religionName] || updatedAt > mapData.get(grade).religionData[religionName].latestUpdate) {
         mapData.get(grade).religionData[religionName] = {
         count: count,
         latestUpdate: updatedAt,
         }
         mapData.get(grade).total += count
      }
   })

   const result = Array.from(mapData.entries()).map(([grade, { total, religionData }]) => {
      const year = students[0].year
      const gradeResult : any = {
         grade: parseInt(grade),
         year: year,
         total: total
      }

      religions.forEach(religion => {
         const religionName = religion.name.toLowerCase().replaceAll(' ', '_')
         gradeResult[religionName] = religionData[religionName]?.count || 0
      })

      return gradeResult
   })

   return result.sort((a: any, b: any) => a.grade - b.grade)
}