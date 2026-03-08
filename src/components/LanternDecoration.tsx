const LanternDecoration = () => {
  return (
    <>
      {/* Floating lanterns */}
      <div className="fixed top-8 left-8 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
        🏮
      </div>
      <div className="fixed top-16 right-12 text-3xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        🏮
      </div>
      <div className="fixed bottom-20 left-16 text-2xl opacity-10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        🏮
      </div>

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-red" />
    </>
  );
};

export default LanternDecoration;
