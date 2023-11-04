export const validateNumber = (event: any): void => {
   if (!/^[0-9.-]+$/.test(event.key) || (event.key === '.' && event.target!.value.includes('.')) || (event.key === '-' && event.target!.value.includes('-'))) {
      event.preventDefault()
   }
}