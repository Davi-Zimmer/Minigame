import { ComponentBase, ComponentBaseProps } from "../Components/BaseComponent.js"

interface ButtonProps extends ComponentBaseProps {
    active: Function
    text?: string
}

export class Button extends ComponentBase {
   
    private active
    private text

    constructor( { x, y, w, h, border=0, bkg="#000", borderColor="#505050", active, text} : ButtonProps ){
        super({ x, y, w, h, type:"Button", border, bkg, borderColor })

        this.active = active
        this.text = text
    }

    interact() {
        return this.active()
    }

    render( ctx: CanvasRenderingContext2D ){

        this.drawElement( ctx )

        if( this.text ){
            ctx.font = "50px Arial";
            ctx.fillText(this.text, this.x, this.y);
        }
    }

}