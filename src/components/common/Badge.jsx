// src/components/common/Badge.jsx
export default function Badge({ status }) {
  const isDraft = status === "draft";
  return (
    <span className={`badge ${isDraft ? "badge-draft" : "badge-posted"}`}>
      {isDraft ? "Draft" : "Posted"}
    </span>
  );
}
