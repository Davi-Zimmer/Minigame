import { Camera } from "../Core/Camera";
import { Tile, TileProps } from "../Tiles/Tiles.js";

export class Ground extends Tile {
    constructor( props : TileProps ){
        
        props.type = "Ground"
        props.solid = true

        super( props )

    }

    render(ctx: CanvasRenderingContext2D, cam: Camera, spriteSize:number): void {
        
        ctx.fillStyle = 'green'

        const [ x, y, w, h ] = [
            (this.x * cam.zoom) - (cam.x * cam.zoom),
            (this.y * cam.zoom) - (cam.y * cam.zoom),
            this.w * cam.zoom,
            this.h * cam.zoom
        ]
        
        ctx.fillRect(x, y, w+1, h+1)

    }
    
}