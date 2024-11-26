import { BaseObject } from "../Bases/ObjectBase.js"
import { Camera } from "../Core/Camera.js"
import { Weapon } from "../Itens/Weapon.js"
import { Projectile } from "../Projectile/Projectile.js"
import { Ground } from "../Tiles/Ground.js"
import { Entity, EntityProps} from "./Entity.js"

export interface PlayerProps extends EntityProps {
}

export class Player extends Entity {
    private acceptedKeys: Record<string, Function> = {}
    private keysToExecute: Record<string, Function> = {}

    private onAir:boolean = false
    public canMove:boolean = true
    public direction: Array<number> = [0, 0]
    private jumps:number = 3

    constructor( props : PlayerProps ){

        if( !props.zindex ) props.zindex = 2

        super( props )

        // this.speed = props.speed
        const runAnimation = () => {
            this.changeAnimation("running")
        }

        this.acceptedKeys = {
            // w: () => { this.direction[1] = -this.speed },
            a: () => { this.direction[0] = -this.speed; this.invertedSprite = false; runAnimation() },
            d: () => { this.direction[0] =  this.speed; this.invertedSprite = true ; runAnimation() },
            s: () => { this.direction[1] =  this.speed },
            numpadsubtract: () => {
                // this.getDamaged(50, this)

                return true
            },

            space: () => {
                this.onAir = true,
                this.jumps--
                if( this.jumps >= 0 ) this.orientation = [0, -30]

                return true
            },
        }

        this.sprites = {
            idle: [[0, 0, 20, 37]],
            running: [
                [44, 0, 21, 37],
                [44, 0, 21, 37],
                [66, 0, 21, 37],
                [88, 0, 21, 37],
            ],
            
        }

        this.changeAnimation("idle")

        this.setMissPercent( 20 )

        this.setWeapon( new Weapon({
            damage: 1,
            description:"",
            name:'cringe',
            x:0, y:0, w: 50, h: 50
        }))

    }

    clickEvent( {clientX, clientY} : MouseEvent, createElement:Function, cam:Camera){
         let [mx, my]= this.getMiddle()
        
        const projectile = new Projectile({
            x: mx,
            y: my,
            w:10,
            h:10,
            speed: 20,
            life: 50,
            mouseX: clientX + cam.x,
            mouseY: clientY + cam.y,
            sender: this,
            activation: ( target:Entity ) => {
                this.atack( target  )
            }
        })

        /*
        const entity = new Entity({
            x: 200, y: 100, w: 100, h: 100,
            life: 100, type: 'any',
            speed: 10, 
        })
        createElement( entity )
        */

       createElement( projectile )

    }

    getKeyEvents(){
        
        return {
            acceptedKeys: this.acceptedKeys,
            keysToExecute: this.keysToExecute,
            
        }

    }

    movementAndCollision( collider: Function ){

        // quando o player bate na quina de algum bloco, ele fica preso.
        // não sei porq ue isso acontece, mas acho que vou deixar como fature

        const [dx, dy] = this.direction
        const gravity = 1

        const testX = this.x + dx + this.orientation[ 0 ]
        const testY = this.y + dy + this.orientation[ 1 ] + gravity

        if( dx + this.orientation[ 0 ] == 0 ){
            this.changeAnimation('idle')
        }

        // collider retorna a lista de itens em colisão com esta classe
        // seria bom otimizar isso.
        const collisionsX = collider({x: testX , y:this.y, w:this.w, h:this.h, self:this})
        const collisionsY = collider({x: this.x, y:testY , w:this.w, h:this.h, self:this})

        // atualização de movimento do player por frame
        // const isTile = ( item:Entity | Projectile ) => item instanceof Ground

        if( !(collisionsX[0] instanceof Ground)) {

            this.x += dx + this.orientation[ 0 ]

        }
        else this.orientation[0] = 0


        if( !(collisionsY[0] instanceof Ground)) {

            this.y += dy + this.orientation[ 1 ]
        }
        else {
            
            this.orientation[1] = 0

            // isso evita que o player seja teleportado para o tyle a cima dele
            if( collisionsY[0].y > this.y){
                // faz a colisão ser perfeita no chão
                this.y = collisionsY[0].y - this.h
            }

        }

        // reseta a direção, se n ele fica andando infinitamente
        this.direction = [0, 0]


        // chão e gravidade
        // ps descobri que isso fica alternando entre true/false quando no chão em vez de apenas 
        const ground = collisionsY.some( (item:BaseObject) => item.type == 'Ground' && item.y > this.y + 10 )
        
        if( !ground ){

            this.orientation[ 1 ] += gravity

            this.onAir = true
            
        } else {

            this.onAir = false

            this.jumps = 3

        }
    }

    tick( collider: Function ){

        this.damageCooldownSubtractor()

        if( this.canMove ) this.movementAndCollision( collider )

        this.updateAnimation()
    }

    render(ctx: CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement) {
        ctx.fillStyle = 'red'
        
        let [x, y, w, h] = cam.calcCoords( this )

        // adiciona a posição das variaveis de velocidade pra evitar um bug visual
        if( this.canMove ){
            x -= (this.orientation[ 0 ] - this.direction[ 0 ]) * cam.zoom
            y -= (this.orientation[ 1 ] - this.direction[ 1 ]) * cam.zoom
        }
        
        const renderSprite = this.getSpriteToRenter(x, y, w, h)
       

        /*
        const renderMe = (b:number) => {
        
            ctx.fillStyle = 'blue'
            ctx.fillRect( x-b, y-b, w+b*2, h+b*2 )
        }
        
        renderMe( (this.damageCooldown % 2) * 5  )
        */
        renderSprite(spriteSheet, ctx, spriteSize)

        this.posRender( ctx, [x, y, w, h], cam)


        const lifeBar = {
            x: innerWidth,
            y: 100,
            w: 300,
            h: 50
        }

        lifeBar.x -= lifeBar.w + 100

        const border = 5

        // this.entityLifeBar()
        this.entityLifeBar(ctx, lifeBar, "lime", "gray", border)
        //ctx.fillRect(x, y, w, h)
    }

    setLife( life:number ) {
        this.life = Math.min( this.maxLife , life )
    }

    // get(){ return this. }
    // set(:){ this. =}


}