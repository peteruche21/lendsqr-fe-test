import { Page, PageHeader } from "@/pages/shared";

export function NotFoundPage() {
  return (
    <Page
      header={
        <PageHeader title="With a heavy heart, we inform you that the page you are looking for does not exist." />
      }
    />
  );
}
