export default function CRTFilter() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 500,
        background: `
          linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
          linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))
        `,
        backgroundSize: '100% 3px, 4px 100%',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.85)',
      }}
    />
  );
}

