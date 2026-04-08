import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * iOS ホーム画面追加用のアイコン。
 * iOS では角丸が自動で適用されるので、フルサイズで描画する。
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          color: '#FFFFFF',
          fontSize: 130,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
