import { handleUsersRequest } from '@/api/users/handler'

export default {
  fetch(request) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/users')) {
      return handleUsersRequest(request)
    }

    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler
