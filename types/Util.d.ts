declare namespace Util {
   type Router = {
      label: string
      to?: string
      icon?: string
      children?: Util.Router[]
   }
}