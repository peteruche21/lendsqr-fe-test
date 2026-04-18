import { useState } from 'react'
import { MoveLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchUserById } from '@/api'
import { Page, PageHeader } from '@/pages/shared'
import { Button } from '@/components'
import { QUERY_STALE_TIME_MS } from '@/constants'
import { useUserStore } from '@/store/userStore'
import { UserStatus } from '@/types'
import { UserDetailsSummary } from './components/UserDetailsSummary'
import { UserDetailsGeneral } from './components/UserDetailsGeneral'
import type { TabId } from './components/UserDetailsTabs'
import './UserDetailPage.scss'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('general')
  
  const updateUserStatus = useUserStore((s) => s.updateUserStatus)
  const getUserStatus = useUserStore((s) => s.getUserStatus)

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const data = await fetchUserById(id!)
      if (data) {
        useUserStore.getState().saveUser(data)
      }
      return data
    },
    enabled: !!id,
    staleTime: QUERY_STALE_TIME_MS,
  })

  // Resolve status with persistence directly in the object to maintain strict typings
  const userWithStatus = user 
    ? { ...user, status: getUserStatus(user.id, user.status) } 
    : null;

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
      <Button 
        variant="outline" 
        className="button--blacklist"
        onClick={() => id && updateUserStatus(id, UserStatus.Blacklisted)}
      >
        BLACKLIST USER
      </Button>
      <Button 
        variant="outline" 
        className="button--activate"
        onClick={() => id && updateUserStatus(id, UserStatus.Active)}
      >
        ACTIVATE USER
      </Button>
    </>
  )

  if (isLoading || !userWithStatus) {
    return (
      <Page header={<PageHeader title="User Details" />} showLogo={false}>
        <div className="user-detail-loading">Loading...</div>
      </Page>
    )
  }

  if (isError) {
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
        <UserDetailsSummary 
          user={userWithStatus} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="user-detail-page__tab-content">
          {activeTab === 'general' && (
            <UserDetailsGeneral user={userWithStatus} />
          )}
          {activeTab === 'documents' && (
            <div className="user-detail-page__placeholder">Documents display here.</div>
          )}
          {activeTab === 'bank' && (
            <div className="user-detail-page__placeholder">Bank Details display here.</div>
          )}
          {activeTab === 'loans' && (
            <div className="user-detail-page__placeholder">Loans display here.</div>
          )}
          {activeTab === 'savings' && (
            <div className="user-detail-page__placeholder">Savings display here.</div>
          )}
          {activeTab === 'system' && (
            <div className="user-detail-page__placeholder">App and System display here.</div>
          )}
        </div>
      </section>
    </Page>
  )
}
