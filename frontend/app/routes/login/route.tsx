import { ActionFunctionArgs, MetaFunction, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { appName, logoUrl } from '~/utils'
import { loginAction } from './action'
import { authCookie } from '~/services/auth'
import InputComponent from '~/components/InputComponent'
import Button from '~/components/Button'

export const meta: MetaFunction = () => {
  return [{ title: `Sign In - ${appName}` }]
}

export async function action({ request }: ActionFunctionArgs) {
  let { errors, userData } = await loginAction(request)

  if (!errors) {
    return redirect('/admin', {
      headers: {
        'Set-Cookie': await authCookie.serialize(userData),
      },
    })
  }

  return { errors }
}

export default function Login() {
  let actionData = useActionData<typeof action>(),
    emailError = actionData?.errors?.email,
    passwordError = actionData?.errors?.password

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-10 w-auto" src={logoUrl} alt="" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form className="space-y-6" method="POST">
            <InputComponent
              id="email"
              name="email"
              type="email"
              label="Email address"
              error={emailError}
            />

            <InputComponent
              id="password"
              name="password"
              type="password"
              label="Password"
              error={passwordError}
            />

            <Button type="submit">Sign in</Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
