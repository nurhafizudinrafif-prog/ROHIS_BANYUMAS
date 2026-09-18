import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { getDirectImageUrl, extractGoogleDriveId } from '../utils/media';

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'Tempel URL gambar / link Google Drive, atau klik tombol upload...',
  tip,
  required = false,
  aspectRatioHint = 'Landscape / Rasio Bebas',
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    // Limit check (recommend under 8MB to prevent local storage quota issues)
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran berkas melebihi 8MB. Mohon gunakan foto dengan ukuran lebih kecil untuk performa optimal.');
      return;
    }

    setIsProcessing(true);
    setLoadError(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        onChange(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
      alert('Gagal membaca berkas gambar. Silakan coba gambar lain.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isDataUrl = typeof value === 'string' && value.startsWith('data:image');
  const driveId = typeof value === 'string' ? extractGoogleDriveId(value) : null;
  const isDrive = Boolean(driveId);
  const displaySrc = typeof value === 'string' && value ? getDirectImageUrl(value) : '';

  return (
    <div className="admin-image-field-block">
      {label && (
        <div className="image-field-label-row">
          <label className="form-label">
            {label} {required && <span className="text-danger">*</span>}
          </label>
          {aspectRatioHint && (
            <span className="aspect-hint-badge">{aspectRatioHint}</span>
          )}
        </div>
      )}

      {/* Input Group: URL text input + Upload Button */}
      <div className="image-input-action-row">
        <div className="image-input-wrapper">
          <span className="image-input-icon">
            <ImageIcon size={16} />
          </span>
          <input
            type="text"
            className="form-input image-url-input"
            value={value || ''}
            onChange={(e) => {
              setLoadError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            required={required && !value}
          />
        </div>

        <button
          type="button"
          className="btn btn-gold btn-upload-trigger"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          title="Pilih dan upload foto dari memori komputer atau smartphone"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={15} className="spin-icon" />
              <span>Memuat...</span>
            </>
          ) : (
            <>
              <Upload size={15} />
              <span>Pilih Berkas Foto</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Live Preview Card if image is provided */}
      {value && typeof value === 'string' && value.trim().length > 0 && (
        <div className="image-live-preview-card">
          <div className="image-preview-figure">
            {!loadError ? (
              <img
                src={displaySrc}
                alt="Pratinjau Foto"
                onError={() => {
                  if (driveId) {
                    setLoadError(false);
                  } else {
                    setLoadError(true);
                  }
                }}
              />
            ) : (
              <div className="image-preview-error">
                <ImageIcon size={28} />
                <span>Gambar tidak dapat dimuat dari URL ini</span>
              </div>
            )}
            <div className="image-type-indicator">
              {isDataUrl ? (
                <span className="badge-tag-file">📁 FOTO LOKAL (UPLOAD)</span>
              ) : isDrive ? (
                <span className="badge-tag-drive">☁️ GOOGLE DRIVE</span>
              ) : (
                <span className="badge-tag-web">🌐 WEB URL</span>
              )}
            </div>
          </div>

          <div className="image-preview-meta">
            <div className="image-meta-info">
              <strong className="image-meta-title">
                {isDataUrl ? 'Foto Berhasil Diunggah' : isDrive ? 'Terhubung ke Google Drive' : 'Foto dari Tautan Web'}
              </strong>
              <p className="image-meta-path text-muted" title={value}>
                {isDataUrl
                  ? `Format Data URL Base64 (~${Math.round(value.length / 1024)} KB)`
                  : value.length > 55
                  ? value.substring(0, 52) + '...'
                  : value}
              </p>
            </div>

            <div className="image-meta-actions">
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={() => fileInputRef.current?.click()}
                title="Ganti dengan foto lain"
              >
                <RefreshCw size={13} /> Ganti Foto
              </button>
              <button
                type="button"
                className="btn btn-danger-ghost btn-xs"
                onClick={() => {
                  onChange('');
                  setLoadError(false);
                }}
                title="Hapus foto ini"
              >
                <X size={14} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {tip && (
        <p className="image-field-tip text-muted">
          💡 {tip}
        </p>
      )}
    </div>
  );
}
