export default function Alert({ type = 'info', message, onClose }) {
  const bg = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ⓘ'
  };

  return (
    <div className={`${bg[type]} text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center`}>
      <span>{icon[type]} {message}</span>
      {onClose && <button onClick={onClose}>✕</button>}
    </div>
  );
}
