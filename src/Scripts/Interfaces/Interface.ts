import { Rect, RectProps } from "../Bases/Rect.js";
import { ComponentBase } from "../Interfaces/Components/BaseComponent.js";
import { Button } from "./Components/Button.js";

export interface InterfaceProps extends RectProps {
    components?: Array<ComponentBase>
}

export class Interface extends Rect {
    private components
    
    constructor( {x, y, w, h, type="Interface", components=[]} : InterfaceProps ){

        super({ x, y, w, h, type })

        this.components = components

        this.createComponents()

    }

    createComponents(){
        const btn  = new Button({
            x: 100,
            y: 100,
            w: 100,
            h: 100,
            border: 5,
            active: () => console.log("AAAAAAAAAAAAAA")
        })

        this.components.push( btn )
        
    }

    getComponents(){
        return this.components
    }

    render( ctx: CanvasRenderingContext2D ){

        ctx.fillStyle = 'yellow'
        ctx.fillRect(this.x, this.y, this.w, this.h)

        this.components.forEach(cmp => cmp.render( ctx ))

    }
}

/*

import { RectProps, Rect } from "../Bases/Rect.js"

export interface InterfaceProps extends RectProps{
    name: string
    zindex?: number
}

export class Interface extends Rect {
    public name: string


    constructor( props:InterfaceProps ){
        super( props )

        props.type = 'Interface'

        if( !props.zindex ) props.zindex = 2

        super( props )

        this.name = props.name
        
    }

    changeTo(  ){

    }    

}
*/