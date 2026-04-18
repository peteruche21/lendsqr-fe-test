import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from '@/components'
import { DEFAULT_LOGIN_FORM_VALUES, LOGIN_SUBMIT_DELAY_MS } from '@/constants'
import { validateEmail, validatePassword, wait } from '@/utils'

export function LoginPage() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: DEFAULT_LOGIN_FORM_VALUES,
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onDynamic: ({ value }) => {
        const fields = {
          email: validateEmail(value.email),
          password: validatePassword(value.password),
        }

        if (!fields.email && !fields.password) {
          return undefined
        }

        return { fields }
      },
    },
    onSubmit: async () => {
      await wait(LOGIN_SUBMIT_DELAY_MS)
      void navigate('/users')
    },
  })

  return (
    <main className="login-layout">
      <Logo className="login-layout__logo" />

      <section className="login-layout__media" aria-hidden="true">
        <img alt="" className="login-layout__vector" src="/login-vector.png" />
      </section>

      <section className="login-layout__panel">
        <div className="login-page">
          <div className="login-page__intro">
            <h1 className="login-page__title">Welcome</h1>
            <p className="login-page__subtitle">Enter details to login.</p>
          </div>

          <form
            className="login-page__form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <form.Subscribe selector={(state) => state.submissionAttempts}>
              {(submissionAttempts) => (
                <div className="login-page__fields">
                  <form.Field name="email">
                    {(field) => (
                      <Input
                        autoComplete="email"
                        error={
                          submissionAttempts > 0
                            ? (field.state.meta.errors[0] as string | undefined)
                            : undefined
                        }
                        label="Email"
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="Email"
                        type="email"
                        value={field.state.value}
                      />
                    )}
                  </form.Field>

                  <form.Field name="password">
                    {(field) => (
                      <Input
                        autoComplete="current-password"
                        error={
                          submissionAttempts > 0
                            ? (field.state.meta.errors[0] as string | undefined)
                            : undefined
                        }
                        label="Password"
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="Password"
                        type="password"
                        value={field.state.value}
                      />
                    )}
                  </form.Field>

                  <Button
                    className="login-page__forgot-password"
                    variant="ghost"
                  >
                    Forgot Password
                  </Button>
                </div>
              )}
            </form.Subscribe>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  className="login-page__submit"
                  fullWidth
                  loading={isSubmitting}
                  loadingLabel="Logging in..."
                  type="submit"
                >
                  Log In
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </section>
    </main>
  )
}
