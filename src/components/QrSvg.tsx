import qrcode from 'qrcode-generator'

/** A QR code drawn as inline SVG (generated locally; nothing is sent anywhere). */
export function QrSvg({ text, label, className = '' }: { text: string; label: string; className?: string }) {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const svg = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true })
  return <div role="img" aria-label={label} className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}
