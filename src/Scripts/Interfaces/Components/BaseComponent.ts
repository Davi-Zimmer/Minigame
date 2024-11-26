import { Rect, RectProps } from "../../Bases/Rect.js";

export interface ComponentBaseProps extends RectProps {
    border?: number
    bkg?: string
    borderColor?: string
    clickable?: boolean
}

export class ComponentBase extends Rect {
    public border
    public bkg
    public borderColor
    public clickable

    constructor( { x, y, w, h, border=0, bkg="#000", borderColor="#505050", clickable=false } : ComponentBaseProps ){
        super({ x, y, w, h, type:"Button" })

        this.border = border
        this.bkg = bkg
        this.borderColor = borderColor
        this.clickable = clickable

    }

   interact(){
        return null
   }

    getMidlle(){
        return [
            this.x + this.w / 2,
            this.y + this.h / 2
        ]
    }

    drawElement( ctx:CanvasRenderingContext2D ){
        const border = this.border

        const a = {
            x: this.x + border,
            y: this.y + border,
            w: this.w - border * 2,
            h: this.h - border * 2
        }

        ctx.fillStyle = this.borderColor
        ctx.fillRect( this.x, this.y, this.w, this.h )

        ctx.fillStyle = this.bkg
        ctx.fillRect( a.x, a.y, a.w, a.h )
    }

    render( ctx: CanvasRenderingContext2D ){

        this.drawElement( ctx )

    }

}