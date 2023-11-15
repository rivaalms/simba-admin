type Map = {
   subject: string
   value: number
   updated: number | null
}

export const mapTeachers = async (teachers: Model.School.Teacher[], subjects: Util.Subject[]) : Promise <Util.MapTeacher[]> => {
   const mapData : Map[] = []

   teachers.forEach(item => {
      const updatedAt = new Date(item.updated_at!).getTime()

      if (!mapData.find(data => data.subject === item.subject!.name) || updatedAt > mapData.find(data => data.subject === item.subject!.name)?.updated!) {
         mapData.push({
            subject: item.subject?.name!,
            value: item.count,
            updated: updatedAt
         })
      }
   })

   subjects.forEach(subjectItem => {
      if (!mapData.find(data => data.subject === subjectItem.name)) {
         mapData.push({
            subject: subjectItem.name,
            value: 0,
            updated: null
         })
      }
   })

   return mapData.map(({ updated, ...rest }) => rest).sort((a, b) => b.value - a.value)
}