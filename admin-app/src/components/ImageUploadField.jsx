import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
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
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
          </label>
          {aspectRatioHint && (
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--antique-brass)',
              background: 'rgba(181, 141, 79, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              border: '1px solid rgba(181, 141, 79, 0.25)',
            }}>
              {aspectRatioHint}
            </span>
          )}
        </div>
      )}

      {/* Input Group: URL text input + Upload Button */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <ImageIcon size={16} />
          </span>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
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
          className="btn"
          style={{
            background: 'linear-gradient(135deg, var(--antique-brass), #967035)',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            padding: '0.65rem 1rem',
          }}
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
              <span>Pilih Foto</span>
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

      {/* Live Preview Card */}
      {value && typeof value === 'string' && value.trim().length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 80,
            height: 60,
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            background: '#05080E',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {!loadError ? (
              <img
                src={displaySrc}
                alt="Pratinjau Foto"
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => {
                  if (driveId) {
                    setLoadError(false);
                  } else {
                    setLoadError(true);
                  }
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <ImageIcon size={20} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                background: isDataUrl ? 'rgba(59, 130, 246, 0.2)' : isDrive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: isDataUrl ? '#60A5FA' : isDrive ? '#34D399' : '#CBD5E1',
              }}>
                {isDataUrl ? 'UPLOAD LOKAL' : isDrive ? 'GOOGLE DRIVE' : 'WEB URL'}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isDataUrl ? 'Foto Berhasil Disimpan' : isDrive ? 'Google Drive Terhubung' : 'Foto Online'}
              </span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0,
            }} title={value}>
              {value}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => fileInputRef.current?.click()}
              title="Ganti dengan foto lain"
            >
              <RefreshCw size={12} /> Ganti
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171' }}
              onClick={() => {
                onChange('');
                setLoadError(false);
              }}
              title="Hapus foto ini"
            >
              <X size={12} /> Hapus
            </button>
          </div>
        </div>
      )}

      {tip && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', marginBotom: 0 }}>
          💡 {tip}
        </p>
      )}
    </div>
  );
}
