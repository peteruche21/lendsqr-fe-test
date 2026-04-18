import { serve } from 'bun'
import index from './index.html'
import { handleUsersRequest } from '@/api/users/handler'

const server = serve({
  port: Number(process.env.PORT ?? 5174),

  routes: {
    '/favicon.svg': new Response(Bun.file('public/favicon.svg')),
    '/logo.svg': new Response(Bun.file('public/logo.svg')),

    '/api/users': {
      GET(request): Promise<Response> {
        return handleUsersRequest(request)
      },
    },

    '/*': index,
  },

  development: process.env.NODE_ENV !== 'production' && {
    console: false,
    hmr: true,
  },
})

console.log(`Server running at ${server.url}`)
