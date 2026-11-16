function GlassCard({ children, className = "", ...rest }) {
  return (
    <div className={`glass p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default GlassCard;
