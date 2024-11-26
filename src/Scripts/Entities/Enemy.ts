import { Camera } from "../Core/Camera.js";
import { Entity, EntityProps } from "../Entities/Entity.js";
import { Life } from "../Itens/Life.js";
import { Weapon } from "../Itens/Weapon.js";
import { Ground } from "../Tiles/Ground.js";

export interface EnemyProps extends EntityProps {
    target?: Entity | null,
    forgive?: boolean,
    force?: number
} 

export class Enemy extends Entity {
    private upsetWith: Entity | null = null
    private timeToForgive: number = 0
    private aceleration: Array<number> = [0, 0]
    private forigive:boolean = true
    private randomAct:() => void

    constructor( props : EnemyProps){
        super( props )

        this.setMissPercent( 10 )

        this.setDamageAction( (target:Entity) => {
            this.upsetWith = target

            // um 30 segundos pra perdoar o alvo
            this.timeToForgive = 1800
        })

        this.upsetWith = props.target || null

        this.forigive = props.forgive || true

        this.setForce( props.force || 5 )

        this.setWeapon( new Weapon({
            x: 0, y:0, w: 0, h: 0, damage: 5, description: 'Estou impactado', name:'Impacto'
        }))

        let a = 0
        this.randomAct = () => {
            
            a++
            
            if( a > 200){
                a = 0
                this.action()

            }

        }
        
    }

    follow( entity: Entity ){
        // I I follow I follow you, deep sea, baby
        
        const thisMiddle = this.getMiddle()
        const entityMiddle = entity.getMiddle()

        const xAxis = entityMiddle[0] - thisMiddle[0]
        const yAxis = entityMiddle[1] - thisMiddle[1]

        const distance = Math.sqrt( xAxis**2 + yAxis**2 )

        /*
        if( distance > 2500 ){
            // para de segueir e talvez perca o recentimento

            if( this.forigive ) this.timeToForgive--

            return
        }
        */

        if(distance > 20){
            this.aceleration[0] *= .99
            this.aceleration[1] *= .99
        }

        if( distance < entity.w / 2 || distance < entity.h / 2){

            this.atack( entity )
            
        }


        const directionX = xAxis / distance
        const directionY = yAxis / distance

        this.aceleration[0] += directionX * (Math.random() + 1 )
        this.aceleration[1] += directionY * (Math.random() + 1 )

    }

    collision( collider:Function ){
        const [dx, dy] = this.aceleration

        const testX = this.x + dx
        const testY = this.y + dy

        
        const collisionsX = collider({x: testX , y:this.y, w:this.w, h:this.h, self:this})
        const collisionsY = collider({x: this.x, y:testY , w:this.w, h:this.h, self:this})

        if( !(collisionsX[0] instanceof Ground) ){
            this.x += dx
        } else {
            const [ax, ay] = this.aceleration.map( n => n * .9 )
            this.aceleration = [ax * -.5, ay]
        }

        if( !(collisionsY[0] instanceof Ground) ){
            this.y += dy

        } else {
            const [ax, ay] = this.aceleration.map( n => n * .9 )
            this.aceleration = [ax, ay * -.5 ]
        }

    }

    whenDead( createElement:Function, getScore:Function, setScore:Function ){
    
        const score = getScore() + Math.floor(Math.random() * 5) + 3

        setScore( score )

        const rnd = (n:number) => Math.floor( Math.random() * n) 

        // if( rnd( 5 ) != 1 ) return

        const [x, y] = this.getMiddle()

        let reward = null

        if( rnd( 5 ) != 1){
            reward = new Life({
                description: 'regenera a vida',
                name: 'life',
                x, y, w:50, h:50
            })
        } else {
           
            reward = new Weapon({
                description: 'arma pra se armar :)',
                name: 'arma',
                x, y, w: 50, h: 50, damage: score * .3
            })
        }

        createElement( reward )

    }
   
    tick( collider: Function ){
        this.updateAnimation()

        this.damageCooldownSubtractor()

        this.collision( collider )

        if( this.upsetWith ){
            this.follow( this.upsetWith )

            if( this.timeToForgive <= 0 && !this.forigive){
                this.upsetWith = null
                this.aceleration = [0, 0]
            }

        } else {

            this.randomAct()
        }
        
    }

    render(ctx: CanvasRenderingContext2D, cam: Camera, spriteSize: number, spriteSheet: HTMLImageElement): void {
       
        const [x, y, w, h] = cam.calcCoords( this )
        const renderMe = (b:number) => {
        
            ctx.fillStyle = 'blue'
            ctx.fillRect( x-b, y-b, w+b*2, h+b*2 )
        }

        renderMe( (this.damageCooldown % 2) * 5  )

        this.posRender(ctx, [x,y,w,h], cam)
    }

    action(){
        // faz algo aleatório, no caso anda pra qualquer lado
        // this.aceleration
        const rnd = (n:number) => Math.floor( Math.random() * n)
        const magnitudeX = rnd( 10 )
        const magnitudeY = rnd( 10 )

        const dx = rnd( magnitudeX ) * (rnd(2) * 2 - 1)
        const dy = rnd( magnitudeY ) * (rnd(2) * 2 - 1)

        this.aceleration = [ dx, dy ]

    }
}