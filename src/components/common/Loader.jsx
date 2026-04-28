// src/components/common/Loader.jsx
export function LoadingText() {
  return <p className="loading-text">Loading...</p>;
}

export function ErrorText({ message }) {
  return <p className="error-text">{message}</p>;
}

export function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
}
