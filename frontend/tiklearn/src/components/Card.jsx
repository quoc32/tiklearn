import React, { use, useEffect } from 'react';

export default function Card({
  title,
  description,
  image,
  footer,
  onClick,
  first,
}) {
  // console.log("Card props:", {itemId, title, description, image});

  const [titleState, setTitleState] = React.useState(title);
  const [descriptionState, setDescriptionState] = React.useState(description);

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
      {src && <img src={src} alt={titleState} className="w-full h-48 object-cover" />}

      {/* Chill Guy với hình đứng kế bên và "nói" titleState + descriptionState */}
      <div className="p-4">
        <div className="flex items-end space-x-4 min-h-20">

          {
            first ? 
            (
              <div className="bg-gray-100 p-3 rounded-lg flex-1 m-0">
                <div className="text-sm text-blue-600 font-semibold">Cuộn như cách</div>
                <div className="text-sm text-blue-600 font-semibold">bạn cuộn TikTok đi...</div>
              </div>
            )
            :
            (
              <div className="bg-gray-100 p-3 rounded-lg flex-1 m-0">
                <div className="text-sm text-blue-600 font-semibold">Mô tả: <span className="font-normal">{descriptionState}</span></div>
                <div className="text-sm text-gray-700 font-semibold">Từ vựng: <span className="font-normal">{titleState}</span></div>
              </div>
            ) 
          }

          {/* Tam giác chỉ về phía Chill Guy */}
          <div className="self-center p-0 m-0">
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '12px solid #f3f4f6', // màu tương ứng bg-gray-100
              }}
            />
          </div>

          <img
            src="./chill_guy.png"
            alt="Chill Guy"
            className="w-20 h-20 object-cover rounded self-end"
          />
        </div>
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