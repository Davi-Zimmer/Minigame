import { BaseObject, BaseObjectProps } from "../Bases/ObjectBase.js";
import { Camera } from "../Core/Camera.js";
import { Entity } from "../Entities/Entity.js";

export interface ProjectileProps extends BaseObjectProps {
    //direction
    //angle: number
    speed: number
    zindex?: number
    life: number
    mouseX: number
    mouseY: number
    sender: Entity
    activation: Function
}

export class Projectile extends BaseObject {
    public velocity: Array<number>
    public zindex
    private life = 1
    private sender
    private activation

    constructor( {x, y, w, h, speed, life, mouseX, mouseY, sender, activation } : ProjectileProps){
        super({ x, y, w, h, type:"Projectile"})

        this.zindex = 20

        this.setLife(life)

        this.sender = sender

        this.activation = activation

        // Calcula o vetor direção
        const dx = mouseX - ( x || 0 )
        const dy = mouseY - ( y || 0 )

        // Calcula a magnitude do vetor
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        // Normaliza o vetor e ajusta pela velocidade
        this.velocity = [
            (dx / magnitude) * speed,
            (dy / magnitude) * speed
        ]
       
    }

    collideActivation( entity: Entity ){
    
        //console.log( entity )

        this.activation( entity )
    }

    die( removeElement: Function  ){

        removeElement( this )

    }

    tick( collider: Function ){
        // console.log('EU')

        let life = this.getLife()
        this.setLife( life-1 )
            
        this.x += this.velocity[ 0 ]
        this.y += this.velocity[ 1 ]

        const collisions = collider({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            self:this
        })

        for(const elm of collisions){

            if( elm === this.sender) return
            
            // console.log( elm )
            // && elm.getLife() > 0
            if( elm instanceof Entity ) {

                this.collideActivation( elm )

            }

            this.setLife( 0 )

        }

    }

    render( ctx:CanvasRenderingContext2D, cam:Camera, s:any, a:any ){

        const [ x, y, w, h ] = cam.calcCoords( this )
 
        ctx.fillStyle = 'yellow'
        ctx.fillRect( x, y, w, h )

    }


    setLife( life:number ){ this.life = life  }
    getLife( ){ return this.life }


}