import { MagnetLines } from './MagnetLines'

export function BackgroundMagnetField() {
  return (
    <div className="background-magnet-field" aria-hidden="true">
      <MagnetLines
        rows={16}
        columns={21}
        containerSize="140vmax"
        lineColor="#D4D0C8"
        lineWidth="1px"
        lineHeight="40px"
        baseAngle={-8}
      />
    </div>
  )
}

