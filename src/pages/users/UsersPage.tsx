import { fetchUsers } from "@/api";
import { Card, Pagination } from "@/components";
import { PageSizeDropdown } from "@/components/pagination";
import { DataTable } from "@/components/table";
import { DEFAULT_USER_PAGE_SIZE, QUERY_STALE_TIME_MS } from "@/constants";
import { Page } from "@/pages/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userColumns } from "./components/UserColumns";

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

  const users = query.data?.items ?? [];
  const total = query.data?.pagination.total ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
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
        <Card as="div" className="users__table-wrap">
          <DataTable 
            columns={userColumns} 
            data={users} 
            onRowClick={(user) => navigate(`/users/${user.id}`)}
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
