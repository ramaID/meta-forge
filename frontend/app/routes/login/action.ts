import laraFetch, {
  CSRF_COOKIE,
  CSRF_HEADER,
  laraReq,
  parseCookie,
} from '~/services/laravelFetchers'
import { validate } from './validate'
import { authCookie } from '~/services/auth'

export async function loginAction(request: Request) {
  let formData = await request.formData(),
    email = String(formData.get('email')),
    password = String(formData.get('password')),
    validateFE = validate(email, password)

  if (validateFE !== null) {
    return { errors: validateFE }
  }

  // Signing in user to Laravel
  let setCookie = '',
    { errors } = await laraReq(
      laraFetch('/login', { method: 'post', body: formData }, request),
      (res) => {
        setCookie = String(res?.headers.get('set-cookie'))
      }
    )

  if (errors !== null) {
    return { errors }
  }

  let laravelCookies = await parseCookie(setCookie),
    token = laravelCookies.XSRFToken,
    Cookie = [
      `laravel_session=${laravelCookies.laravelSession}`,
      `${CSRF_COOKIE}=${token}`,
    ].join('; ')

  // setting auth user to laravel
  request.headers.set(
    'Cookie',
    await authCookie.serialize({ Cookie, [CSRF_HEADER]: token })
  )

  // request to laravel to get user data
  let { data } = await laraReq(
    laraFetch('/api/user', { method: 'get' }, request)
  )

  return {
    errors,
    userData: {
      Cookie,
      [CSRF_HEADER]: token,
      user: data as {
        id: number
        name: string
        email: string
        email_verified_at: string | null
        created_at: string
        updated_at: string
      },
    },
  }
}
