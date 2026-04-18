import { NpLoansIcon, NpMoneyIcon, NpUsersGroupIcon, NpUsersIcon } from "@/assets/icons";
import { fetchUsers } from "@/api";
import { Card, Pagination } from "@/components";
import { PageSizeDropdown } from "@/components/pagination";
import { DataTable } from "@/components/table";
import { DEFAULT_USER_PAGE_SIZE, QUERY_STALE_TIME_MS, USER_RECORD_COUNT } from "@/constants";
import { Page, PageHeader } from "@/pages/shared";
import { UserStatus, type User, type UserFilterField, type UserFilters } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { createUserColumns } from "./components/UserColumns";
import { UserTableFilter } from "./components/UserTableFilter";

type UserStatCard = {
  backgroundColor: string;
  icon: ReactNode;
  label: string;
  value: number;
};

type FilterAnchor = {
  left: number;
  top: number;
};

const FILTER_POPOVER_WIDTH = 270;
const FILTER_POPOVER_VIEWPORT_MARGIN = 24;

const DEFAULT_USER_FILTERS: UserFilters = {
  dateJoined: "",
  email: "",
  organization: "",
  phoneNumber: "",
  status: "",
  username: "",
};

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_USER_PAGE_SIZE);
  const [openFilter, setOpenFilter] = useState<UserFilterField | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<FilterAnchor | null>(null);
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_USER_FILTERS);
  const navigate = useNavigate();

  const cursor = (currentPage - 1) * pageSize;
  const query = useQuery({
    queryFn: () =>
      fetchUsers({
        cursor,
        filters,
        limit: pageSize,
      }),
    queryKey: ["users", pageSize, currentPage, filters],
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

  const users = useMemo(() => query.data?.items ?? [], [query.data]);
  const tableTotal = query.data?.pagination.total ?? 0;
  const statsTotal = statsQuery.data?.pagination.total ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(tableTotal / pageSize)),
    [tableTotal, pageSize],
  );
  const stats = useMemo(
    () => createUserStats({
      total: statsTotal,
      users: statsQuery.data?.items ?? [],
    }),
    [statsQuery.data, statsTotal],
  );
  const activeFilters = useMemo(() => {
    const fields = Object.entries(filters)
      .filter(([, value]) => value !== "")
      .map(([field]) => field as UserFilterField);

    return new Set(fields);
  }, [filters]);
  const columns = useMemo(
    () =>
      createUserColumns({
        activeFilters,
        onOpenFilter: (field, trigger) => {
          const rect = trigger.getBoundingClientRect();
          const preferredLeft =
            field === "status" ? rect.right - FILTER_POPOVER_WIDTH : rect.left;
          const maxLeft =
            window.innerWidth - FILTER_POPOVER_WIDTH - FILTER_POPOVER_VIEWPORT_MARGIN;
          const viewportLeft = Math.min(
            Math.max(preferredLeft, FILTER_POPOVER_VIEWPORT_MARGIN),
            Math.max(maxLeft, FILTER_POPOVER_VIEWPORT_MARGIN),
          );

          if (openFilter === field) {
            setOpenFilter(null);
            setFilterAnchor(null);
            return;
          }

          setOpenFilter(field);
          setFilterAnchor({
            left: viewportLeft + window.scrollX,
            top: rect.bottom + window.scrollY + 16,
          });
        },
        onViewDetails: (user) => navigate(`/users/${user.id}`),
        openFilter,
      }),
    [activeFilters, navigate, openFilter],
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

  const handleFilterChange = <Field extends UserFilterField>(
    field: Field,
    value: UserFilters[Field],
  ) => {
    setCurrentPage(1);
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFilterReset = (field: UserFilterField) => {
    setCurrentPage(1);
    setFilters((current) => ({
      ...current,
      [field]: DEFAULT_USER_FILTERS[field],
    }));
    setOpenFilter(null);
    setFilterAnchor(null);
  };

  return (
    <Page header={<PageHeader title="Users" />} showLogo={false}>
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
            <span className="users__footer-text">out of {tableTotal}</span>
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

        {openFilter && filterAnchor
          ? createPortal(
              <>
                <div
                  aria-hidden="true"
                  className="users__filter-backdrop"
                  onClick={() => {
                    setOpenFilter(null);
                    setFilterAnchor(null);
                  }}
                />
                <div
                  className="users__filter-popover"
                  style={{
                    left: filterAnchor.left,
                    top: filterAnchor.top,
                  }}
                >
                  <UserTableFilter
                    field={openFilter}
                    label={getUserFilterLabel(openFilter)}
                    onChange={handleFilterChange}
                    onReset={handleFilterReset}
                    value={filters[openFilter]}
                  />
                </div>
              </>,
              document.body,
            )
          : null}
      </section>
    </Page>
  );
}

function getUserFilterLabel(field: UserFilterField): string {
  switch (field) {
    case "dateJoined":
      return "Date"
    case "email":
      return "Email"
    case "organization":
      return "Organization"
    case "phoneNumber":
      return "Phone Number"
    case "status":
      return "Status"
    case "username":
      return "Username"
  }
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
