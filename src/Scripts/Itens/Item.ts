import { BaseObject, BaseObjectProps } from "../Bases/ObjectBase.js";
import { Camera } from "../Core/Camera.js";
import { Entity } from "../Entities/Entity.js";
import { Player } from "../Entities/Player.js";

export interface ItemProps extends BaseObjectProps {
    name: string
    description: string
}

export class Item extends BaseObject {
    private deltaY:number = 0
    private sprite: Array<number>
    private name: string = ''
    private description: string = ''
    private life:number = 1

    constructor({ x, y, w, h, name, description }:ItemProps){

        super({ x, y, w, h, type:"Item" })

        this.sprite = [0, 0, 20, 37]
        
        this.setName( name )
        this.setDescription(description)
    }

    die( removeElement: Function, createElement:Function){
        removeElement( this )

    }

    activation( target: Player ){

    }

    tick( collider: Function ){
        
        const collision =  collider({x: this.x , y:this.y, w:this.w, h:this.h, self:this})

        const player = collision.find( (entity:Entity) => entity instanceof Player)

        if( player ){
            this.activation( player )
            this.setLife( 0 )
                
        }
        
        this.deltaY += .05
    }

    renderSprite( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement, color:string){

        const [ x, y, w, h ] = cam.calcCoords( this )//.map( n => n *= spriteSize)

        const [ sx, sy, sw, sh ] = this.sprite

        // calcula os pecados que pesarão acima do item...
        const delta = Math.sin(this.deltaY) * 10

        ctx.fillStyle = color
        ctx.fillRect( x, y + delta, w, h)

        //ctx.drawImage(spriteSheet, sx, sy, sw, sh, x, y + delta, w, h )
    }

    render( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement ){
        this.renderSprite( ctx, cam, spriteSize, spriteSheet, 'lime')

    }


    getName() { return this.name }
    getDescription(){ return this.description }

    setName( name:string ) { this.name = name }
    setDescription( desciption:string ){ this.description = desciption }


    getLife() { return this.life }
    setLife( life:number ) { this.life = life }

}