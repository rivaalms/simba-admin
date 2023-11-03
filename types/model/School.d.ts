declare namespace Model {
   namespace School {
      type Type = {
         id: number
         name: string
         created_at?: string | null
         updated_at?: string | null
      }

      type Student = {
         id: number
         school_id: number
         grade: number
         islam: number
         catholic: number
         protestant: number
         hindu: number
         buddha: number
         konghucu: number
         created_at?: string | null
         updated_at?: string | null
      }

      type Teacher = {
         id: number
         school_id: number
         year: string
         math: number
         science: number
         ind_lit: number
         eng_lit: number
         social: number
         civic: number
         islam: number
         catholic: number
         protestant: number
         hindu: number
         buddha: number
         konghucu: number
         counseling: number
         art: number
         sport: number
         entrepreneurship: number
         created_at?: string | null
         updated_at?: string | null
      }
   }
}