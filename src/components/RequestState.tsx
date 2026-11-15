import { LoaderCircle, RefreshCw } from "lucide-react";
import "./RequestState.scss";

export function RequestState({
  loading = false,
  message,
  onRetry,
}: {
  loading?: boolean;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={`request-state${loading ? " request-state--loading" : " request-state--error"}`}
      role={loading ? "status" : "alert"}
      aria-busy={loading}
    >
      {loading && (
        <LoaderCircle
          className="request-state__spinner"
          size={26}
          aria-hidden="true"
        />
      )}
      <p>{message}</p>
      {onRetry && (
        <button className="button button--primary" onClick={onRetry}>
          <RefreshCw size={16} /> Спробувати ще
        </button>
      )}
    </div>
  );
}
