import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/**
 * PWA / favicon 用のアプリアイコン。
 * Nav の Logo（白角丸 + 黒の "L"）と同じデザインを大サイズで生成する。
 */
export default function Icon() {
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
        }}
      >
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 80,
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0A0A',
            fontSize: 240,
            fontWeight: 700,
            letterSpacing: -8,
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
