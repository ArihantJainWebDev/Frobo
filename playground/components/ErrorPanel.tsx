'use client';

interface ErrorPanelProps {
  errors: string[];
  onClose: () => void;
}

export default function ErrorPanel({ errors, onClose }: ErrorPanelProps) {
  return (
    <div className="bg-red-900 border-t border-red-700 px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-red-200 font-semibold mb-2">Compilation Errors</h3>
          {errors.map((error, index) => (
            <div key={index} className="text-red-100 text-sm font-mono mb-1">
              {error}
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-red-200 hover:text-white ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}