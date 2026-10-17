const styles = {
  Pending: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}