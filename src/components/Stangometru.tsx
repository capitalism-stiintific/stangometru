export default function Stangometru({ score }: { score: number }) {
    const min = -100
    const max = 400
    const range = max - min
    const scorePosition = ((score - min) / range) * 100
    
    const clampedPosition = Math.max(0, Math.min(100, scorePosition))
    
    const scoreCm = score / 10
    
    return (
        <div className="w-full py-8">
            <div className="relative w-full h-16">
                {/* Ruler line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
                
                {/* Score indicator */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ left: `${clampedPosition}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg" />
                    <div className="absolute top-full -translate-y-full left-1/2 -translate-x-1/2 -mt-6 text-sm font-bold text-primary whitespace-nowrap">
                        {scoreCm > 0 ? `+${scoreCm.toFixed(1)}` : scoreCm.toFixed(1)} cm
                    </div>
                </div>
                
                {/* Tick marks and labels */}
                {[-100, -50, 0, 50, 100, 150, 200, 250, 300, 350, 400].map((value) => {
                    const position = ((value - min) / range) * 100
                    const cmValue = value / 10
                    return (
                        <div
                            key={value}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="w-0.5 h-3 bg-foreground/50" />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-muted-foreground whitespace-nowrap">
                                {cmValue > 0 ? `+${cmValue}` : cmValue} cm
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}