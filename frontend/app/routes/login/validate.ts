export function validate(email: string, password: string) {
  let errors: { email?: string; password?: string } = {}

  if (!email) {
    errors.email = 'is required'
  } else if (!email.includes('@')) {
    errors.email = 'is not a valid email'
  }

  if (!password) {
    errors.password = 'is required'
  } else if (password.length < 5) {
    errors.password = 'must be at least 5 characters'
  }

  return Object.keys(errors).length ? errors : null
}
