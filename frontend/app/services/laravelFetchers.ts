import { redirect } from '@remix-run/node'
import { authCookie } from './auth'

type laraFetchOptions = {
  method?: string
  body?: FormData | Record<string, any>
}

export const CSRF_COOKIE = 'XSRF-TOKEN',
  CSRF_HEADER = 'X-XSRF-TOKEN'

export default async function laraFetch<T>(
  path: RequestInfo,
  { ...options }: laraFetchOptions,
  request?: Request
): Promise<T> {
  const { BE_URL } = process.env

  let body = undefined,
    method = options.method?.toLowerCase() || 'get',
    isMutation = ['post', 'put', 'patch', 'delete'].includes(method),
    Cookie = request?.headers.get('Cookie'),
    token = null

  method = method.toUpperCase()

  if (Cookie) {
    let cookies = await authCookie.parse(Cookie)

    token = cookies[CSRF_HEADER]
    Cookie = cookies.Cookie
  }

  if (isMutation && !Cookie) {
    let responseCsrf = await fetch(`${BE_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
      }),
      cookies = String(responseCsrf.headers.get('set-cookie')),
      laravelCookies = await parseCookie(cookies)

    token = laravelCookies.XSRFToken
    Cookie = [
      `laravel_session=${laravelCookies.laravelSession}`,
      `${CSRF_COOKIE}=${token}`,
    ].join(';')
  }

  // TODO: makes typescript happy about this headers variable
  let headers: any = {
    ...(token && {
      Cookie,
      [CSRF_HEADER]: token,
    }),
    accept: 'application/json',
    Referer: 'http://localhost:3000',
  }

  if (options?.body instanceof FormData) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    }
    body = JSON.stringify(Object.fromEntries(options.body))
  }

  let response = await fetch(`${BE_URL}${path}`, {
    headers,
    method,
    body,
  })

  return response as T
}

export async function laraReq<T, K>(
  fetchable: Promise<T>,
  onSuccess?: (param?: Response) => K,
  onUnauthorized?: (param?: Response) => K
): Promise<{
  data: T
  errors: Record<string, string[]> | null
}> {
  let data = null,
    errors = null,
    response = await fetchable

  if (!(response instanceof Response)) {
    throw new Error('Something went wrong')
  }

  let { status } = response

  if (status === 419) {
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await authCookie.serialize('', {
          maxAge: 0,
        }),
      },
    })
  }

  if (status === 401) {
    await onUnauthorized?.(response)
  }

  if ([422, 200].includes(status)) {
    let json = await response.json()

    if (status === 422) {
      errors = json.errors
    } else {
      data = json
    }
  }

  await onSuccess?.(response)

  return { data, errors }
}

export async function parseCookie(setCookie: string): Promise<{
  XSRFToken: string
  laravelSession: string
}> {
  let XSRFToken = '',
    laravelSession = '',
    cookies = setCookie.split(',')

  for (let index = 0; index < cookies.length; index++) {
    let cookie = cookies[index]

    if (cookie.includes(CSRF_COOKIE)) {
      XSRFToken = await getCookie(CSRF_COOKIE, cookie)
    }

    if (cookie.includes('laravel_session')) {
      laravelSession = await getCookie('laravel_session', cookie.split(';')[0])
    }
  }

  return {
    XSRFToken,
    laravelSession,
  }
}

async function getCookie(name: string, cookieString: string): Promise<string> {
  if (name === 'laravel_session') {
    return decodeURIComponent(cookieString.split('=')[1])
  }

  let match = cookieString.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))

  return match ? decodeURIComponent(match[3]) : ''
}
