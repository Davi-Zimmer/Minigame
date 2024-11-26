import { BaseObject, BaseObjectProps } from "../Bases/ObjectBase.js"
import { Camera } from "../Core/Camera.js"

export interface TileProps extends BaseObjectProps {
    type?: string
    solid?: boolean
    layer?: number
    zindex?: number
    classType?:string
}

export class Tile extends BaseObject {
    public layer: number
    public solid: boolean
    public zindex: number

    constructor( {x, y, w, h, type='Air', layer, solid, zindex = 0, classType = "Tile"} : TileProps ){
        super({ x, y, w, h, classType, type })
        this.zindex = zindex

        this.layer = layer || 2
        this.solid = solid || false
          
    }

    tick(){}

    render( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement ){}
}