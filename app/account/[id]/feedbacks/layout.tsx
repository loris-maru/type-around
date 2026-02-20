import LayoutFeedbacks from "@/components/layout/layout-feedbacks";

export default function FeedbacksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutFeedbacks>{children}</LayoutFeedbacks>;
}
