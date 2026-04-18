import { MoveLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/api";
import { Page, PageHeader } from "@/pages/shared";
import { Button } from "@/components";
import { QUERY_STALE_TIME_MS } from "@/constants";
import { useUserStore } from "@/store/userStore";
import { UserStatus } from "@/types";
import "./UserDetailPage.scss";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const updateUserStatus = useUserStore((s) => s.updateUserStatus);
  const getUserStatus = useUserStore((s) => s.getUserStatus);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const data = await fetchUserById(id!);
      if (data) {
        useUserStore.getState().saveUser(data);
      }
      return data;
    },
    enabled: !!id,
    staleTime: QUERY_STALE_TIME_MS,
  });

  // Resolve status with persistence
  const status = user ? getUserStatus(user.id, user.status) : undefined;
  const userWithStatus = user ? { ...user, status } : null;

  const navigation = (
    <button
      className="user-detail-page__back"
      type="button"
      onClick={() => navigate("/users")}
    >
      <MoveLeft size={30} />
      <span>Back to Users</span>
    </button>
  );

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
  );

  if (isLoading) {
    return (
      <Page header={<PageHeader title="User Details" />} showLogo={false}>
        <div className="user-detail-loading">Loading...</div>
      </Page>
    );
  }

  if (isError || !user) {
    return (
      <Page
        header={<PageHeader navigation={navigation} title="User Details" />}
        showLogo={false}
      >
        <div className="user-detail-error">
          <p>User not found or error loading particulars.</p>
        </div>
      </Page>
    );
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
          <pre className="user-detail-debug">
            {JSON.stringify(userWithStatus, null, 2)}
          </pre>
        </div>
      </section>
    </Page>
  );
}
