// src/components/LoadingButton.jsx
import LoadingSpinner from "./LoadingSpinner";

const LoadingButton = ({
  loading,
  children,
  loadingText,
  className = "",
  ...props
}) => {
  return (
    <button disabled={loading} className={`relative ${className}`} {...props}>
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner />
          <span>{loadingText || "Loading..."}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
