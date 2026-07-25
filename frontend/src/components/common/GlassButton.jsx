function GlassButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`glass-btn ${
        variant === "secondary" ? "secondary" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default GlassButton;