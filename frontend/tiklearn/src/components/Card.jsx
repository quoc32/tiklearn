import React from 'react';

export default function Card({
  title = 'Card Title',
  description = 'This is a short description for the card.',
  image,
  footer,
  onClick,
}) {
  // image can be either a full data URI (starts with "data:") or raw base64 string.
  const src =
    typeof image === 'string'
      ? image.trim().startsWith('data:')
        ? image
        : `data:image/png;base64,${image}`
      : undefined;

  return (
    <div
      onClick={onClick}
      className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src && <img src={src} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>

      {footer ? (
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500">{footer}</span>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Action
          </button>
        </div>
      ) : null}
    </div>
  );
}