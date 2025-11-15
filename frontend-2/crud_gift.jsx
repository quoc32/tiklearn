import React, { useEffect, useState, useRef } from 'react'

// Admin CRUD for gifts (demo)
// - Lists existing gifts
// - Add new gift (name, cost, image URL)
// - Edit gift
// - Delete gift
// This component is self-contained and simulates server calls. To integrate
// with a backend, replace the simulated delays with fetch/axios calls to
// your API endpoints (/api/products, /api/gifts, etc.).
export default function CrudGift() {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Modal state
  const [editing, setEditing] = useState(null) // gift being edited
  const [deleting, setDeleting] = useState(null) // gift being deleted
  const [showAdd, setShowAdd] = useState(false)

  // Form state for add/edit (include quantity)
  const [form, setForm] = useState({ id: null, name: '', cost: 0, src: '', quantity: 0 })

  const nameRef = useRef(null)

  const BACKEND_BASE = import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:8080'

  const normalizeSrc = (s) => {
    if (!s) return s
    if (s.startsWith('http://') || s.startsWith('https://')) return s
    // ensure leading slash
    return `${BACKEND_BASE}${s.startsWith('/') ? '' : '/'}${s}`
  }

  useEffect(() => {
    // Load initial gifts. Try backend /api/products first, fallback to demo list.
    (async () => {
      setLoading(true)
      try {
        try {
          const res = await fetch('/api/products')
          if (res.ok) {
            const data = await res.json()
            const mapped = data.map((p, idx) => ({
              id: p.name,
              name: p.name.replace(/[-_.]/g, ' ').replace(/\.[^.]+$/, ''),
              cost: [300, 500, 800][idx] || 500,
              src: p.src,
              quantity: [5, 3, 10][idx] || 5
            }))
            setGifts(mapped)
            setLoading(false)
            return
          }
        } catch (e) {
          // ignore and fallback to demo
        }

        // Demo fallback (use absolute backend URLs so images load from Spring Boot)
        setGifts([
          { id: 'casio', name: 'Đồng hồ Casio', cost: 800, src: normalizeSrc('/product/casio.webp'), quantity: 5 },
          { id: 'ao', name: 'Áo Thun', cost: 300, src: normalizeSrc('/product/ao.png'), quantity: 10 },
          { id: 'balo', name: 'Balo gấu', cost: 500, src: normalizeSrc('/product/cap.webp'), quantity: 3 },
          { id: 'hopbut', name: 'Hộp bút', cost: 200, src: normalizeSrc('/product/hopbut.webp'), quantity: 8 },
        ])
      } catch (e) {
        setError('Không thể tải danh sách quà')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const resetForm = () => setForm({ id: null, name: '', cost: 0, src: '', quantity: 0 })

  const openAdd = () => {
    resetForm()
    setShowAdd(true)
    setTimeout(() => nameRef.current?.focus(), 50)
  }

  const handleFormChange = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const handleCreate = async () => {
    if (!form.name || !form.src || Number(form.cost) <= 0 || Number(form.quantity) < 0) return setError('Vui lòng điền đầy đủ thông tin')
    setLoading(true)
    setError(null)
    try {
      // Simulate server create (replace with POST /api/gifts)
      await new Promise((r) => setTimeout(r, 500))
      const id = form.id || form.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 6)
      const newGift = { id, name: form.name, cost: Number(form.cost), src: form.src, quantity: Number(form.quantity) }
      setGifts((prev) => [newGift, ...prev])
      setShowAdd(false)
      resetForm()
    } catch (e) {
      setError('Không thể thêm quà (demo)')
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = (g) => {
    setEditing(g)
    setForm({ id: g.id, name: g.name, cost: g.cost, src: g.src, quantity: g.quantity ?? 0 })
    setTimeout(() => nameRef.current?.focus(), 50)
  }

  const handleSaveEdit = async () => {
    if (!form.name || !form.src || Number(form.cost) <= 0 || Number(form.quantity) < 0) return setError('Vui lòng điền đầy đủ thông tin')
    setLoading(true)
    try {
      // Simulate update (replace with PUT /api/gifts/:id)
      await new Promise((r) => setTimeout(r, 400))
      setGifts((prev) => prev.map((g) => (g.id === form.id ? { ...g, name: form.name, cost: Number(form.cost), src: form.src, quantity: Number(form.quantity) } : g)))
      setEditing(null)
      resetForm()
    } catch (e) {
      setError('Không thể lưu thay đổi (demo)')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (g) => {
    setLoading(true)
    try {
      // Simulate delete (replace with DELETE /api/gifts/:id)
      await new Promise((r) => setTimeout(r, 400))
      setGifts((prev) => prev.filter((x) => x.id !== g.id))
      setDeleting(null)
    } catch (e) {
      setError('Không thể xóa (demo)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Quản lý quà</h2>
        <div>
          <button onClick={openAdd} className="px-3 py-2 bg-indigo-600 text-white rounded">Thêm quà</button>
        </div>
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="bg-white border rounded p-3">
        {loading && <div className="text-sm text-gray-500 mb-2">Đang xử lý...</div>}
        {gifts.length === 0 ? (
          <div className="text-sm text-gray-500">Không có quà nào.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {gifts.map((g) => (
              <div key={g.id} className="flex items-center gap-4 p-3 border rounded">
                <img src={normalizeSrc(g.src)} alt={g.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-xs text-gray-600">{g.cost} điểm • <span className="text-xs text-gray-600">Còn: {g.quantity ?? 0}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleStartEdit(g)} className="px-2 py-1 bg-yellow-400 text-white rounded">Sửa</button>
                  <button onClick={() => setDeleting(g)} className="px-2 py-1 bg-red-600 text-white rounded">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Thêm quà mới</h3>
            <div className="space-y-2">
              <div>
                <label htmlFor="add-name" className="block text-sm font-medium text-gray-700">Tên quà</label>
                <input id="add-name" ref={nameRef} value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Tên quà" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label htmlFor="add-cost" className="block text-sm font-medium text-gray-700">Giá (điểm)</label>
                <input id="add-cost" value={form.cost} onChange={(e) => handleFormChange('cost', e.target.value)} placeholder="Giá (điểm)" type="number" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label htmlFor="add-quantity" className="block text-sm font-medium text-gray-700">Số lượng</label>
                <input id="add-quantity" value={form.quantity} onChange={(e) => handleFormChange('quantity', e.target.value)} placeholder="Số lượng" type="number" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label htmlFor="add-src" className="block text-sm font-medium text-gray-700">URL ảnh</label>
                <input id="add-src" value={form.src} onChange={(e) => handleFormChange('src', e.target.value)} placeholder="URL ảnh (http... hoặc /product/xxx)" className="w-full p-2 border rounded mt-1" />
              </div>
              {form.src && <img src={normalizeSrc(form.src)} alt="preview" className="w-full h-40 object-cover rounded" />}
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAdd(false)} className="px-3 py-2 bg-gray-200 rounded">Huỷ</button>
                <button onClick={handleCreate} disabled={loading} className="px-3 py-2 bg-green-600 text-white rounded">Thêm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Sửa quà</h3>
            <div className="space-y-2">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Tên quà</label>
                <input id="edit-name" ref={nameRef} value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Tên quà" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label htmlFor="edit-cost" className="block text-sm font-medium text-gray-700">Giá (điểm)</label>
                <input id="edit-cost" value={form.cost} onChange={(e) => handleFormChange('cost', e.target.value)} placeholder="Giá (điểm)" type="number" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700">Số lượng</label>
                <input id="edit-quantity" value={form.quantity} onChange={(e) => handleFormChange('quantity', e.target.value)} placeholder="Số lượng" type="number" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label htmlFor="edit-src" className="block text-sm font-medium text-gray-700">URL ảnh</label>
                <input id="edit-src" value={form.src} onChange={(e) => handleFormChange('src', e.target.value)} placeholder="URL ảnh (http... hoặc /product/xxx)" className="w-full p-2 border rounded mt-1" />
              </div>
              {form.src && <img src={normalizeSrc(form.src)} alt="preview" className="w-full h-40 object-cover rounded" />}
              <div className="flex justify-end gap-2">
                <button onClick={() => { setEditing(null); resetForm() }} className="px-3 py-2 bg-gray-200 rounded">Huỷ</button>
                <button onClick={handleSaveEdit} disabled={loading} className="px-3 py-2 bg-green-600 text-white rounded">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleting(null)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-700 mb-4">Bạn có chắc muốn xóa <strong>{deleting.name}</strong> không? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleting(null)} className="px-3 py-2 bg-gray-200 rounded">Huỷ</button>
              <button onClick={() => handleDelete(deleting)} disabled={loading} className="px-3 py-2 bg-red-600 text-white rounded">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
