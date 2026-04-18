import { MoveLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchUserById } from '@/api'
import { Page, PageHeader } from '@/pages/shared'
import { Button } from '@/components'
import { QUERY_STALE_TIME_MS } from '@/constants'
import './UserDetailPage.scss'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME_MS,
  })

  const navigation = (
    <button 
      className="user-detail-page__back" 
      type="button" 
      onClick={() => navigate('/users')}
    >
      <MoveLeft size={30} />
      <span>Back to Users</span>
    </button>
  )

  const actions = (
    <>
      <Button variant="outline" className="button--blacklist">BLACKLIST USER</Button>
      <Button variant="outline" className="button--activate">ACTIVATE USER</Button>
    </>
  )

  if (isLoading) {
    return (
      <Page header={<PageHeader title="User Details" />} showLogo={false}>
        <div className="user-detail-loading">Loading...</div>
      </Page>
    )
  }

  if (isError || !user) {
    return (
      <Page header={<PageHeader navigation={navigation} title="User Details" />} showLogo={false}>
        <div className="user-detail-error">
          <p>User not found or error loading particulars.</p>
        </div>
      </Page>
    )
  }

  return (
    <Page 
      header={
        <PageHeader 
          actions={actions}
          navigation={navigation} 
          title="User Details" 
        />
      } 
      showLogo={false}
    >
      <section className="user-detail-page">
        <div className="user-detail-page__content">
          {/* Full UI Implementation Coming Next */}
          <pre className="user-detail-debug">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </section>
    </Page>
  )
}
