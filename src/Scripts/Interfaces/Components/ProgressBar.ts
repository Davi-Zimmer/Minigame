import { ComponentBase, ComponentBaseProps } from "./BaseComponent"

interface ProgresBarProps extends ComponentBaseProps {
    maxProgress: number
    progress: number
    progressColor?: string
}

export class ProgressBar extends ComponentBase {
    public maxProgress
    public progress
    public progressColor

    constructor( { x, y, w, h, progress, maxProgress, progressColor='#FFF' } : ProgresBarProps ){

        super({ x, y, w, h, type:"ProgressBar" })

        this.maxProgress = maxProgress
        this.progress = progress
        this.progressColor = progressColor

    }

    getProgressPercent(){
        const relativeW = this.w - this.border
        return this.progress * relativeW / this.maxProgress 
    }

    render( ctx:CanvasRenderingContext2D ){

        this.drawElement( ctx )

        const progress = this.getProgressPercent()
        
        const g = {
            x: this.x + this.border ,
            y: this.y + this.border,
            w: progress,
            h: this.y + this.h - this.border * 2,
        }

        ctx.fillStyle = this.progressColor

        ctx.fillRect( g.x, g.y, g.w, g.h )

    }


}