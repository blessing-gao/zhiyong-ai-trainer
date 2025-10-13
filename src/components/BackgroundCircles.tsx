const BackgroundCircles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      {/* 三个蓝色渐变圆形 */}
      <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
        background: 'radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 70%)'
      }}></div>
      <div className="absolute bottom-20 -right-50 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
        background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
      }}></div>
      <div className="absolute bottom-60 -right-40 w-[500px] h-[500px] rounded-full animate-float" style={{
        background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
        animationDelay: '1s'
      }}></div>
    </div>
  );
};

export default BackgroundCircles;
