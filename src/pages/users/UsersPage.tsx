import { NpLoansIcon, NpMoneyIcon, NpUsersGroupIcon, NpUsersIcon } from "@/assets/icons";
import { fetchUsers } from "@/api";
import { Card, Pagination } from "@/components";
import { PageSizeDropdown } from "@/components/pagination";
import { DataTable } from "@/components/table";
import { DEFAULT_USER_PAGE_SIZE, QUERY_STALE_TIME_MS, USER_RECORD_COUNT } from "@/constants";
import { Page } from "@/pages/shared";
import { UserStatus, type User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserColumns } from "./components/UserColumns";

type UserStatCard = {
  backgroundColor: string;
  icon: ReactNode;
  label: string;
  value: number;
};

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_USER_PAGE_SIZE);
  const navigate = useNavigate();

  const cursor = (currentPage - 1) * pageSize;
  const query = useQuery({
    queryFn: () =>
      fetchUsers({
        cursor,
        limit: pageSize,
      }),
    queryKey: ["users", pageSize, currentPage],
    staleTime: QUERY_STALE_TIME_MS,
  });
  const statsQuery = useQuery({
    queryFn: () =>
      fetchUsers({
        limit: USER_RECORD_COUNT,
      }),
    queryKey: ["users", "stats"],
    staleTime: QUERY_STALE_TIME_MS,
  });

  const users = query.data?.items ?? [];
  const total = query.data?.pagination.total ?? statsQuery.data?.pagination.total ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );
  const stats = useMemo(
    () => createUserStats({
      total,
      users: statsQuery.data?.items ?? [],
    }),
    [statsQuery.data, total],
  );
  const columns = useMemo(
    () =>
      createUserColumns({
        onViewDetails: (user) => navigate(`/users/${user.id}`),
      }),
    [navigate],
  );
  const statusMessage = query.isError
    ? "Unable to load users."
    : query.isLoading
      ? "Loading users..."
      : query.isFetching
        ? "Refreshing users..."
        : "";

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <Page copy="Users" showLogo={false}>
      <section className="users">
        <div className="users__stats" aria-label="User statistics">
          {stats.map((stat) => (
            <UserStatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <Card as="div" className="users__table-wrap">
          <DataTable 
            columns={columns} 
            data={users} 
          />
        </Card>

        <footer className="users__footer">
          <div className="users__footer-left">
            <span className="users__footer-text">Showing</span>
            <PageSizeDropdown
              onChange={handlePageSizeChange}
              value={pageSize}
            />
            <span className="users__footer-text">out of {total}</span>
            {statusMessage && (
              <span className="users__status">{statusMessage}</span>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => goToPage(currentPage + 1)}
            onPageChange={goToPage}
            onPrevious={() => goToPage(currentPage - 1)}
          />
        </footer>
      </section>
    </Page>
  );
}

function createUserStats({
  total,
  users,
}: {
  total: number;
  users: User[];
}): UserStatCard[] {
  const activeUsers = users.filter((user) => user.status === UserStatus.Active).length;
  const usersWithLoans = users.filter((user) => user.hasLoan).length;
  const usersWithSavings = users.filter((user) => user.hasSavings).length;

  return [
    {
      backgroundColor: "#DF18FF1A",
      icon: <NpUsersIcon />,
      label: "Users",
      value: total,
    },
    {
      backgroundColor: "#5718FF1A",
      icon: <NpUsersGroupIcon />,
      label: "Active Users",
      value: activeUsers,
    },
    {
      backgroundColor: "#F55F441A",
      icon: <NpLoansIcon />,
      label: "Users With Loans",
      value: usersWithLoans,
    },
    {
      backgroundColor: "#FF33661A",
      icon: <NpMoneyIcon />,
      label: "Users With Savings",
      value: usersWithSavings,
    },
  ];
}

function UserStatCard({ stat }: { stat: UserStatCard }) {
  return (
    <Card as="article" className="users-stat-card">
      <div
        className="users-stat-card__icon"
        style={{ backgroundColor: stat.backgroundColor }}
      >
        {stat.icon}
      </div>
      <p className="users-stat-card__label">{stat.label}</p>
      <p className="users-stat-card__value">{stat.value.toLocaleString("en-US")}</p>
    </Card>
  );
}
