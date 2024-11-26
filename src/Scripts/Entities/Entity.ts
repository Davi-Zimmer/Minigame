import { BaseObject, BaseObjectProps } from "../Bases/ObjectBase.js"
import { Camera } from "../Core/Camera.js"
import { Weapon } from "../Itens/Weapon.js"

export interface EntityProps extends BaseObjectProps {
    life: number
    speed: number
    type: string
    zindex?: number
    classType?: string
    orientation?: Array<number>
    //sprites: SpriteProps
    //spriteSheet: HTMLImageElement
    //spriteStatus?: string

}

export class Entity extends BaseObject {
    protected life

    //private entitySprites: Record<string, Array<number>>
    public animationName = 'idle'
    public animationFrame = 0
    public maxFrames = 0
    public currentFrameDelay = 0
    public maxFrameDelay = 7
    public sprites:Record<string, Array<Array<number>>>
    
    //private spriteSheet
    public orientation: Array<number> = [0, 0]
    public canMove = true
    public speed: number
    public invertedSprite:boolean = false
    public posRenderFuncs: Array< Function > = []
    public damageCooldown:number = 0
    private attackCooldown:number = 0

    private name:string = ''
    private force:number = 0
    private weapon:Weapon | null = null
    private missPercent: number = 0
    private damageAction: Function | null = null
    protected maxLife:number = 500


    constructor( props : EntityProps ){
        
        props.classType = props.classType || "entity"

        if( !props.zindex ) props.zindex = 2

        super( props )

        this.speed = props.speed
        this.life = props.life

        this.sprites = {
            idle: [[0, 0, 20, 37]]            
        }


        // this.animation = props.spriteStatus || 'idle'
        //this.changeAnimation('idle')
        
        /*
        this.spriteSheet = props.spriteSheet
        props.sprites.forEach(spr => {
            this.entitySprites[ spr.name ] = spr.position
        });
        */
    }

    /*
    changeAnimation( animationName:string ){
        const frames = this.sprites[ animationName ]

        if( !frames ){
            return
        }

        this.maxFrames = frames.length

    }
    getCurrentAnimation(){
        return this.sprites[ this.animation ]
    }
    */

    getCollisionMask(){
        this.updateCollisionMask()

        const { x, y, w, h } = this.collisionMask
        const [ dx, dy ] = this.orientation

        return {x: x + dx, y: y + dy, w, h}
    }

    getMiddle(){
        return [
            this.x + this.w / 2,
            this.y + this.h / 2
        ]
    }

    updateAnimation(){
        //console.log(this.currentFrameDelay)

        if( this.currentFrameDelay > this.maxFrameDelay ){
            this.currentFrameDelay = 0
            this.animationFrame++

            if( this.animationFrame > this.maxFrames){
                this.animationFrame = 0
            }

        }

        this.currentFrameDelay++
    }

    changeAnimation( animationName:string ){
        const animation = this.sprites[ animationName ]
        
        if( this.animationName == animationName ) return 
        
        this.animationName = animationName
        
        this.maxFrames = animation.length - 1

        // evita pegar uma animação pelo index maior que a animação anterior
        this.animationFrame = Math.min( this.maxFrames, this.animationFrame )

    }

    getCurrentAnimationFrame( ){
        const currentAnimation = this.animationName
        const spriteList = this.sprites[ currentAnimation ]

        const frame = spriteList[ this.animationFrame ]

        return frame

    }

    getSpriteToRenter(x:number, y:number, w:number, h:number){

        return (spriteSheet:HTMLImageElement, ctx:CanvasRenderingContext2D, spriteSize:number ) => {
            const [ sx, sy, sw, sh ] = this.getCurrentAnimationFrame().map( n => n *= spriteSize)

       
            if (this.invertedSprite) {
                ctx.save(); // Salvar o estado do contexto
                ctx.scale(-1, 1); // Escalar negativamente no eixo X
                ctx.drawImage(spriteSheet, sx, sy, sw, sh, -x, y, -w, h);
                ctx.restore();
        
            }
            else {
                ctx.drawImage(spriteSheet, sx, sy, sw, sh, x, y, w, h);
            }
        }
       
    }

    atack( target:Entity ){

        const weapon = this.getWeapon()

        if( !weapon || this.getAttckCooldown() > 0  || target.damageCooldown > 0) return
        
        const damage = this.getForce() + weapon.getDamage()
                
        const missPercent = this.getMissPercent()

        const randomNumber = Math.floor(Math.random() * 100)       

        if( randomNumber < missPercent ){
            //miss
            this.missAtack()
            return
        
        }

        target.getDamaged( damage, this )
        
    }
    
    floatingText(color:string, msg:string, counter:number = 100, size:number = 100){

    
        const counerInitial = counter
        const rdn = Math.random()


        this.addInPosRender((ctx:CanvasRenderingContext2D, [x, y, w, h]:Array<number>, cam:Camera) => {

            if( counter <= 0 )  return true

            ctx.globalAlpha = counter / 10  * .1

            //ctx.fillText(msg, x + w/2, (y + h/2 ) - counter, 500)
            ctx.font = `${size}px Arial`

            ctx.fillStyle = color
            ctx.fillText(
                msg,
                x + rdn * w,
                (y - counerInitial*2) + counter
                , size * 3)

            ctx.globalAlpha = 1

            counter--

        })
    }

    missAtack(){

      this.floatingText("white", "Errou", 100, 50)

    }

    entityLifeBar(ctx:CanvasRenderingContext2D, lifeBar:Record<string, number>, color:string, backcolor:string, border:number){
        ctx.fillStyle = backcolor
        ctx.fillRect( lifeBar.x, lifeBar.y, lifeBar.w, lifeBar.h )

        const life = this.getLife()

        ctx.fillStyle = color
        ctx.fillRect(
            lifeBar.x + border,
            lifeBar.y + border,
            life * (lifeBar.w - border * 2) / this.getMaxLife(),
            lifeBar.h - border * 2
        )
    }

    getDamaged( damage:number, sender:Entity ){
        const life = this.getLife() - damage

        this.setLife( life )

        this.damageCooldown = 10

        this.floatingText("red",  damage.toFixed(1).toString() , 100, 50)

        /*
        this.addInPosRender(( ctx:CanvasRenderingContext2D, [x, y, w, h]:Array<number>) => {
            ctx.fillRect(x,y,w,h)
            return true
        })
        */

        const action = this.getDamageAction()

        action?.( sender )

    }

    whenDead( createElement:Function, getScore:Function, setScore:Function ){}
    
    die( removeElement: Function, createElement:Function, getScore:Function, setScore:Function ){
        // console.log("DIE!!!")
        this.whenDead( createElement, getScore, setScore )
        removeElement( this )
    }

    posRender( ctx : CanvasRenderingContext2D, [x, y, w, h]:Array<number>, cam:Camera){

        // caso o retorno do pos render for true, ele será removido
        this.posRenderFuncs = this.posRenderFuncs
        .filter( func => !( func( ctx, [x, y, w, h], cam) )) 
        
    }

    addInPosRender(func:Function){
        this.posRenderFuncs.push( func )
    }

    tick( collider: Function ){
        this.updateAnimation()
    }

    damageCooldownSubtractor(){
        this.damageCooldown = Math.max(0, this.damageCooldown-1)
    }

    render( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement){
        /*
        const animation = this.getCurrentAnimation()

        const [dx, dy, dw, dh] = animation[this.currentFrame]

        const img = this.spriteSheet

        ctx.drawImage(img, dx, dy, dw, dh, this.x, this.y, this.w, this.h,)
        */

        const [ x, y, w, h ] = cam.calcCoords( this )

        this.posRender( ctx, [x, y, w, h], cam)

        ctx.fillStyle = 'blue'
        ctx.fillRect(x,y,w,h)
    }

    getLife(){ return this.life }
    setLife( life:number ) { this.life = life }

    getName(){ return this.name }
    setName( name:string ) { this.name = name }

    getForce(){ return this.force }
    setForce(force:number){ this.force = force}

    getAttckCooldown(){ return this.attackCooldown }
    setAttckCooldown( attackCooldown:number ) { this.attackCooldown = attackCooldown }

    getWeapon(){ return this.weapon }
    setWeapon(weapon:Weapon){ this.weapon = weapon}

    getDamageAction(){ return this.damageAction }
    setDamageAction(damageAction:Function){this.damageAction = damageAction}

    getMissPercent(){ return this.missPercent }
    setMissPercent(missPercent:number){ this.missPercent = missPercent}

    getMaxLife(){ return this.maxLife }
    setMaxLife(maxLife:number){ this.maxLife = maxLife}

}

