import React, { useState, useEffect } from 'react'

// Redeem UI (single-file): uses two hardcoded products located in
// backend static `/product/casio.webp` and `/product/ao.png`.
// No backend fetch: this is a self-contained demo page.
export default function Redeem() {
	const [balance, setBalance] = useState(1200)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [selected, setSelected] = useState(null)

	// Two preset rewards (casio.webp and ao.png should exist in backend static/product)
	// Use absolute backend URL so Vite dev server loads images from Spring Boot.
	const BACKEND_BASE = import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:8080'
	const [rewards, setRewards] = useState([
		{
			id: 'casio',
			name: 'Máy tính Casio',
			cost: 800,
			description: 'Máy tính Casio chính hãng ',
			src: `${BACKEND_BASE}/product/casio.webp`,
			quantity: 3
		},
		{
			id: 'ao',
			name: 'Áo Thun',
			cost: 300,
			description: 'Áo thun cotton',
			src: `${BACKEND_BASE}/product/ao.png`,
			quantity: 10
		},
        {
            id: 'balo',
            name: 'Balo gấu',
            cost: 500,
            description: 'Cặp gấu bông dễ thương',
            src: `${BACKEND_BASE}/product/cap.webp`,
            quantity: 7
        },
        {
            id: 'hopbut',
            name: 'Hộp bút',
            cost: 200,
            description: 'Hộp bút nhiều ngăn',
            src: `${BACKEND_BASE}/product/hopbut.webp`,
            quantity: 2
        }
	])

	const handleSelect = (r) => {
		setError(null)
		setSuccess(null)
		setSelected(r)
	}

	const handleRedeem = async () => {
		if (!selected) return
		if (selected.cost > balance) {
			// Don't set global error here; show the message in the modal immediately instead.
			return
		}
		setLoading(true)
		setError(null)
		try {
			// Demo: no backend call. Simulate network latency.
			await new Promise((r) => setTimeout(r, 700))
			setBalance((prev) => prev - selected.cost)
			const code = `REDEEM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
			setSuccess(`Đổi thành công: ${selected.name}. Mã: ${code}`)
			// decrement quantity in rewards state
			setRewards((prev) => prev.map((r) => (r.id === selected.id ? { ...r, quantity: Math.max(0, (r.quantity || 0) - 1) } : r)))
			setSelected(null)
		} catch (e) {
			setError('Lỗi khi đổi quà (demo).')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h2 className="text-2xl font-semibold mb-3">Đổi quà</h2>

			<div className="mb-4 p-4 bg-white rounded shadow-sm flex items-center justify-between">
				<div>
					<div className="text-sm text-gray-500">Số điểm của bạn</div>
					<div className="text-3xl font-bold">{balance}</div>
				</div>
				<div>
					<button
						className="px-3 py-2 bg-blue-600 text-white rounded"
						onClick={() => alert('Nạp điểm (demo)')}
					>
						Nạp thêm
					</button>
				</div>
			</div>

			{error && <div className="mb-3 text-sm text-red-600">{error}</div>}
			{success && (
				<div className="mb-3">
					<div className="flex items-start gap-3 p-3 rounded border border-green-200 bg-green-50">
						<div className="flex-1">
							<div className="font-semibold text-green-800">{success.split('. Mã:')[0] || 'Đổi thành công'}</div>
							<div className="text-sm text-green-700 mt-1">Mã đổi thưởng: <span className="font-mono">{(success.split('. Mã:')[1] || '').trim()}</span></div>
							<div className="text-xs text-gray-600 mt-2">Ước tính thời gian nhận quà: 4-5 ngày làm việc.</div>
						</div>
						<div>
							<button
								onClick={() => setSuccess(null)}
								className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs hover:bg-green-200"
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{rewards.map((r) => (
					<div
						key={r.id}
						className={`p-3 border rounded ${selected?.id === r.id ? 'border-indigo-500 shadow' : 'border-gray-200'}`}
					>
						{r.src && (
							<img src={r.src} alt={r.name} className="w-full h-40 object-cover rounded mb-2" />
						)}
						<h4 className="font-semibold">{r.name}</h4>
						<p className="text-xs text-gray-600">{r.description}</p>
						<div className="mt-3 flex items-center justify-between">
							<div>
								<div className="text-sm font-medium">{r.cost} điểm</div>
								<div className="text-xs text-gray-500">Còn: {r.quantity ?? 0}</div>
							</div>
							<div>
								<button
									disabled={loading || (r.quantity ?? 0) <= 0}
									onClick={() => handleSelect(r)}
									className={`px-2 py-1 text-sm text-white rounded ${ (r.quantity ?? 0) <= 0 ? 'bg-gray-400' : 'bg-indigo-600'}`}
								>
									{(r.quantity ?? 0) <= 0 ? 'Hết hàng' : 'Chọn'}
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{selected && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* backdrop */}
					<div
						className="fixed inset-0 bg-black/50"
						onClick={() => !loading && setSelected(null)}
						aria-hidden="true"
					/>

					{/* modal dialog */}
					<div
						role="dialog"
						aria-modal="true"
						className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10"
					>
						<h3 className="text-lg font-semibold mb-2">Xác nhận đổi</h3>
						<p className="text-sm text-gray-700 mb-4">
							Bạn chọn: <strong>{selected.name}</strong> - {selected.cost} điểm
						</p>
									<div className="flex flex-col gap-3">
										{/* instant insufficient-points warning inside modal */}
										{selected && selected.cost > balance && (
											<div className="text-sm text-red-600 bg-red-50 p-2 rounded">Bạn không đủ điểm để đổi phần quà này.</div>
										)}
										<div className="flex justify-end gap-2">
											<button
												disabled={loading}
												onClick={() => setSelected(null)}
												className="px-3 py-2 bg-gray-200 rounded"
											>
												Huỷ
											</button>
											<button
												disabled={loading || (selected && selected.cost > balance)}
												onClick={handleRedeem}
												className={`px-3 py-2 text-white rounded ${selected && selected.cost > balance ? 'bg-gray-400' : 'bg-green-600'}`}
											>
												{selected && selected.cost > balance ? 'Không đủ điểm' : loading ? 'Đang xử lý...' : 'Xác nhận đổi'}
											</button>
										</div>
									</div>
					</div>
				</div>
			)}

			<div className="mt-6 text-xs text-gray-500">Lưu ý: đây là giao diện demo. Hai ảnh demo lấy từ `/product/casio.webp` và `/product/ao.png`.</div>
		</div>
	)
}
