import { useState, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { getDirectImageUrl, extractGoogleDriveId } from '../utils/media';

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'Tempel URL gambar / link Google Drive, atau klik Pilih Foto...',
  tip,
  required = false,
  aspectRatioHint,
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

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran berkas melebihi 8MB. Mohon gunakan foto dengan ukuran lebih kecil.');
      return;
    }

    setIsProcessing(true);
    setLoadError(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result;
      if (!rawData) {
        setIsProcessing(false);
        return;
      }

      if (file.type.includes('svg') || file.size < 50 * 1024) {
        onChange(rawData);
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let w = img.width;
          let h = img.height;
          const maxDim = 800;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          onChange(compressed);
        } catch {
          onChange(rawData);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        onChange(rawData);
        setIsProcessing(false);
      };
      img.src = rawData;
    };
    reader.onerror = () => {
      setIsProcessing(false);
      alert('Gagal membaca berkas gambar.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isDataUrl = typeof value === 'string' && value.startsWith('data:image');
  const driveId = typeof value === 'string' ? extractGoogleDriveId(value) : null;
  const isDrive = Boolean(driveId);
  const displaySrc = typeof value === 'string' && value ? getDirectImageUrl(value) : '';

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className={`form-label-soft ${required ? 'form-label-required' : ''}`} style={{ marginBottom: 0 }}>
            {label}
          </label>
          {aspectRatioHint && (
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-brass-dark)',
                background: 'var(--accent-brass-light)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
              }}
            >
              {aspectRatioHint}
            </span>
          )}
        </div>
      )}

      {/* Input Group: Inset URL text input + Pilih Foto Button */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <ImageIcon size={16} />
          </span>
          <input
            type="text"
            className="form-input-soft"
            style={{ paddingLeft: '2.4rem' }}
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
          className="btn-secondary-soft"
          style={{ padding: '0.65rem 1rem', flexShrink: 0 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          title="Pilih foto dari perangkat"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Memuat...</span>
            </>
          ) : (
            <>
              <Upload size={14} />
              <span>Pilih foto</span>
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

      {/* Preview Card matching Image 07 / Image 05 */}
      {value && typeof value === 'string' && value.trim().length > 0 && (
        <div
          className="admin-soft-card"
          style={{
            marginTop: '0.75rem',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: 80,
              height: 56,
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--surface-inset)',
              border: '1px solid var(--border-default)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!loadError ? (
              <img
                src={displaySrc}
                alt="Pratinjau Foto"
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => {
                  if (driveId) setLoadError(false);
                  else setLoadError(true);
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <ImageIcon size={18} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: isDataUrl ? 'rgba(16, 41, 31, 0.08)' : isDrive ? 'rgba(169, 145, 87, 0.15)' : 'rgba(16, 41, 31, 0.05)',
                  color: isDataUrl ? 'var(--pine-dark)' : isDrive ? 'var(--accent-brass-dark)' : 'var(--text-secondary)',
                }}
              >
                {isDataUrl ? 'UPLOAD LOKAL' : isDrive ? 'GOOGLE DRIVE' : 'LINK URL'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pine-dark)' }}>
                {isDataUrl ? 'Foto Tersimpan' : isDrive ? 'Drive Terhubung' : 'Foto Online'}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0,
              }}
              title={value}
            >
              {value}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <button
              type="button"
              className="btn-secondary-soft"
              style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => fileInputRef.current?.click()}
              title="Ganti foto"
            >
              <RefreshCw size={12} /> Ganti
            </button>
            <button
              type="button"
              className="btn-secondary-soft"
              style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', color: 'var(--status-red)' }}
              onClick={() => {
                onChange('');
                setLoadError(false);
              }}
              title="Hapus foto"
            >
              <Trash2 size={12} /> Hapus
            </button>
          </div>
        </div>
      )}

      {tip && (
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: 0 }}>
          💡 {tip}
        </p>
      )}
    </div>
  );
}
