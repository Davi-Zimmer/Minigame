import { Camera } from "../Core/Camera.js";
import { Weapon } from "../Itens/Weapon.js";
import { Enemy, EnemyProps } from "./Enemy.js";
import { Entity } from "./Entity.js";
import { Player } from "./Player.js";

export interface BossProps extends EnemyProps {
    x?: number
    y?: number
    w?: number
    h?: number
    player?: Player | null
    zindex?: number
    createElement:Function
    cam:Camera
    score: Record<string, Function>
    stars?: Array<Array<number>>
}

function getAnimation(getCurrentFrame:Function, addOne:Function, setCurrentFrame:Function, framesLength:number, maxFrameDelay:number){
    setCurrentFrame( 0 )

    let currentDelay = 0


    return function animation() {
        if( currentDelay > maxFrameDelay ) {
            currentDelay = 0

            addOne()
            const currentFrame = getCurrentFrame() 

                
            // não sei o motivo, mas de alguma forma os sprites acabam indo alem do limite
            if( currentFrame >= framesLength ) {
                setCurrentFrame( framesLength - 1 )

                console.log( getCurrentFrame() )
                return true
            }


            if( currentFrame === framesLength - 1 ){
                
                return true

            }

        }

        currentDelay++
    }

}

export class Boss extends Enemy {
    private irisPosition:Array<number> = [0, 0]
    private currentPlanetSprite: number = 0
    private currentIrisSprite: number = 0
    private functionsToTick: Array<Function> = []
    private inCombat: boolean = false
    private irisTarget:Array<number> = [0, 0]
    private stars:Array<Array<number>> = []
    private bossCollisionMask:Record<string, number> = { x:0, y:0, w:0, h:0 }
    private createElement:Function
    private player
    private score: Record<string, Function> = {}
    private irisRandomizerCooldown:number = 50
    private earthquakeForce:number

    constructor({ speed=0, type="Boss", life=7800, player, zindex, createElement, score, cam, stars} : BossProps ){
        const size = 600
        const pos = {
            x: ( innerWidth / 2 ) - ( size / 2 ),
            y: 50,
        }

        super({ x:pos.x, y:pos.y, w:size, h:size, life, speed, type, zindex })

        this.player = player || null

        this.score = score

        this.sprites = {
            planet: [
                [53, 39, 52, 66],   // fechado
                [0, 106, 52, 66],   // abrindo
                [53, 106,  52, 66], // quase aberto
                [0 , 39, 52, 66],   // aberto
            ],

            eyeball: [
                [ 109, 150, 20, 20 ] // olho... talvez...
            ],

            iris: [
                [ 148, 150, 8, 8 ], // dilatado
                [ 130, 150, 8, 8 ], // fechado
                [ 139, 150, 8, 8 ], // normal
            ],

            tree: [
                [ 109, 0, 95, 149] // arvore?
            ]

        }

        this.createElement = createElement

        let actived = false
        
        const rnd = ( multiplyer:number ) => Math.floor( Math.random() * multiplyer ) 

        this.setDamageAction( () => {

            if( !actived ){

                this.active( rnd, cam )

                actived = true

            }

        })
    
        this.setWeapon( new Weapon({
            damage: 25,
            description:" um terremoto no mundo todo",
            name: "onda de choque"
        }))

        this.setForce( 25 )

        this.stars = stars || []

        this.setMaxLife( life )

        this.earthquakeForce = 0

    }

    active( rnd: (n:number)=>number, cam:Camera){

        const inSeconds = 1000
        
        setTimeout(() => this.currentPlanetSprite = 2, 100 );
        setTimeout(() => this.currentPlanetSprite = 2, 200 );
        setTimeout(() => this.currentPlanetSprite = 3, 300 );
        
        setTimeout(() => {
            

            this.focusOnPlayer()

            this.inCombat = true

            const timeIntervall = 10
            const seconds = 1000
            
            setInterval(() => {

                this.blink()
    
            }, timeIntervall * seconds )

        }, 3 * inSeconds)

        const currentForce = this.getForce()

        this.setForce( Math.min( 100, currentForce * 1.02) )

        
        const calculeSpawnTime = () => {

            const score = Math.max( this.score.getScore(), 1 )
            
            // rnd( 10 ) / (score * .1) + rnd(5)+2
            const spawnEnemyCooldown = rnd( 10 ) / score * .4 + 5


            this.spawnEnemy( rnd, score, cam)
            
            setTimeout( calculeSpawnTime, spawnEnemyCooldown * inSeconds)
        }

        calculeSpawnTime()

    }

    spawnEnemy(rnd:(n:number)=>number, score:number, cam:Camera){

        const xAxisSpawn = rnd(2) == 1 ? -150 + cam.x : innerWidth + 150 + cam.x

        if(this.player){

            const enemy = new Enemy({
                x: xAxisSpawn ,
                y: cam.y - 100,
                w: 100,
                h: 100,
                life: score * .5,
                speed: 10,
                type:"Enemy",
                target: this.player,
                force: Math.min(score / 3 + 5, 30)
            })

            this.createElement( enemy )
        }

    }

    whenDead(createElement: Function, getScore: Function, setScore: Function): void {

        this.earthquakeForce = 0
    }

    blink(){

        const getCurrentFrame = () => this.currentPlanetSprite
        const addOne = () => { this.currentPlanetSprite += 1}
        const setCurrentFrame = (n:number) => { this.currentPlanetSprite = n}

        const animation = getAnimation(
            getCurrentFrame,
            addOne,
            setCurrentFrame,
            this.sprites.planet.length, 5
        )


        this.functionsToTick.push(  animation  )

    }

    focusOnPlayer(){
       
        const getCurrentFrame = () => this.currentIrisSprite
        const addOne = () => { this.currentIrisSprite += 1}
        const setCurrentFrame = (n:number) => { this.currentIrisSprite = n}


        const animation = getAnimation(
            getCurrentFrame,
            addOne,
            setCurrentFrame,
            this.sprites.iris.length, 10
        )

        this.functionsToTick.push(  animation  )

    }

    lookAtPlayer(cam:Camera){
        if( !this.player ) return
        
        const player = this.player

        const thisMiddle = this.getMiddle()
        const playerMiddle = player.getMiddle()

        const xAxis = (playerMiddle[0] - cam.x) - thisMiddle[0] - cam.x / 100
        const yAxis = (playerMiddle[1] - cam.y) - thisMiddle[1] - cam.y / 100

        //this.setIrisPosition( xAxis, yAxis )
        const magnitude = Math.sqrt(xAxis ** 2 + yAxis ** 2)

        const normalizedX = xAxis / magnitude || 0
        const normalizedY = yAxis / magnitude || 0


        let randX = normalizedX
        let randY = normalizedY
        // Define a posição da íris

        if( this.irisRandomizerCooldown <= 0 ){
            const rnd = (n:number) => Math.floor( Math.random() * n)

            let intencity = 20

           randX += rnd(intencity) * (rnd(2) * 2 - 1)

           randY += rnd(intencity) * (rnd(2) * 2 - 1)

        }

        const maxOffset = 35;
        const irisX = randX * maxOffset
        const irisY = randY * maxOffset

        this.irisTarget = [irisX, irisY]

        // this.setIrisPosition(irisX, irisY);

        
    }

    setIrisPosition( x:number = this.irisPosition[0], y:number = this.irisPosition[1] ){

        const clamp = (n:number) => Math.min( Math.max(n, -30), 30 ) 

        this.irisPosition = [ clamp(x), clamp(y) ]
    }

    tick( collider:Function ){

        // console.log( collider )

        this.earthquakeForce = Math.max( this.earthquakeForce -.1, 0) 

        this.irisRandomizerCooldown -= 1

        if( this.irisRandomizerCooldown < 0){
            this.irisRandomizerCooldown = 100 * Math.floor(Math.random()  * 50)
        }

        if( this.currentIrisSprite == 1 ){
            this.earthquakeForce = 50
        } 

        if( this.currentPlanetSprite == 0 && this.inCombat ){

            this.earthquakeForce = 30
            
            this.atack( this.player as Entity ) 
        }


        // se o retorno da função for true, ele sera descartado da lista
        this.functionsToTick = this.functionsToTick.filter( func => !(func()))
        
        this.damageCooldownSubtractor()

    }

    render( ctx: CanvasRenderingContext2D, cam:Camera, spriteSize:number, spriteSheet:HTMLImageElement ){

        // OBS: não recomendo tentar entender o que foi feito aqui, pq é só renderização e um monte de calculo pra relativizar o tamanho de tudo
        if( this.inCombat ) {
            this.lookAtPlayer( cam )

            const directionX = (this.irisPosition[0] + this.irisTarget[0]) * .5
            const directionY = (this.irisPosition[1] + this.irisTarget[1]) * .5

            this.setIrisPosition( directionX, directionY )
          
        }

        const paralaxDivisor = 50

        const planetPosition = {
            x: this.x - cam.x / paralaxDivisor,
            y: this.y - cam.y / paralaxDivisor + 150,
        }

        this.bossCollisionMask = {
            x: this.x - cam.x / paralaxDivisor,
            y: this.y - cam.y / paralaxDivisor + 150,
            w: this.w ,
            h: this.h

        }

        this.getCollisionMask = () => {
            return {
                x: this.x + cam.x,
                y: this.y + cam.y,
                w: this.w ,
                h: this.h
    
            }
        }

        // o frame 0 é o olho fechado, não tem motivos pra renderizar a iris
        if( this.currentPlanetSprite > 0 ) {


            // desenha o fundo preto atras do olho
            const eyeBackground = {
                x: planetPosition.x,
                y: planetPosition.y * 3,
                w: this.w,
                h: this.h 
            }
    
            ctx.beginPath();
            ctx.ellipse(eyeBackground.x + this.w * .5, eyeBackground.y, eyeBackground.w * .49, eyeBackground.h * .3, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "black"; // Cor de preenchimento
            ctx.fill(); // Preenche o oval com a cor definida
            
            
            // desenha o olho
            {

                const eyeBall = this.sprites.eyeball[0]
                
                const [dx, dy, dw, dh] = eyeBall.map( n => spriteSize * n )
    
                const eyeBallPosition = {
                    x: planetPosition.x,
                    y: planetPosition.y,
                    w: this.w * .4,
                    h: this.h * .4
                }
    
                eyeBallPosition.x += eyeBallPosition.w - eyeBallPosition.w * .25;
                eyeBallPosition.y += eyeBallPosition.w

    
                ctx.drawImage( spriteSheet, dx, dy, dw, dh, eyeBallPosition.x, eyeBallPosition.y, eyeBallPosition.w, eyeBallPosition.h  )

            }

            // desenha a iris
            {
                const iris = this.sprites.iris[this.currentIrisSprite]

                const [dx, dy, dw, dh] = iris.map( n => spriteSize * n )
    
                const irisPosition = {
                    x: planetPosition.x,
                    y: planetPosition.y,
                    w: this.w * .2,
                    h: this.h * .2
                } 
    
                irisPosition.x += (irisPosition.w * 2)   + this.irisPosition[0] * this.w * .002
                irisPosition.y += (irisPosition.h * 2.5) + this.irisPosition[1] * this.h * .002
    
                ctx.drawImage( spriteSheet, dx, dy, dw, dh, irisPosition.x, irisPosition.y, irisPosition.w, irisPosition.h  )
            }


        }

        // desenha o planeta
        {
            const planetSprite = this.sprites.planet[ this.currentPlanetSprite ]

            //console.log( this.currentPlanetSprite )

            const [dx, dy, dw, dh] = planetSprite.map( n => spriteSize * n)
            ctx.drawImage( spriteSheet, dx, dy, dw, dh, planetPosition.x, planetPosition.y, this.w, this.h  )
        }

        cam.setEarthquakeForce( this.earthquakeForce )

        /*
        // desenha a arvore
        {

            const tree = this.sprites.tree[0]

            const [dx, dy, dw, dh] = tree.map( n => spriteSize * n)

            const treePosition = {
                x: planetPosition.x - this.w / 2,
                y: planetPosition.y,
                w: this.w * 1.8,
                h: this.h * 3
            }

            treePosition.y -= (treePosition.h + treePosition.h) * .43
            treePosition.x -=  treePosition.w * -.04
            ctx.drawImage( spriteSheet, dx, dy, dw, dh, treePosition.x, treePosition.y, treePosition.w, treePosition.h  )
        }
        */

        if( this.inCombat ){
            const [dx] = this.getMiddle()

            const lifeBar = {
                x: dx - cam.x / paralaxDivisor,
                y: this.y - cam.y / paralaxDivisor,
                w: 1000,
                h: 70
            }
    
            lifeBar.x -= lifeBar.w / 2
    
            const border = 5
    
            this.entityLifeBar(ctx, lifeBar, "blue", "gray", border)

        }      


        this.posRender(ctx, [planetPosition.x, planetPosition.y, this.w, this.h], cam )

    }

    setPlayer( player: Player){ this.player = player }
    getPlayer(){ return this.player }
}