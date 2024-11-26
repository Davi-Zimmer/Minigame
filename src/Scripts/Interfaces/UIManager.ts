import { Interface } from "../Interfaces/Interface.js";
import { Rect } from "../Bases/Rect.js";

export interface UIManagerProps {
    gameWindow: Rect
    isInside: Function    
    currentInterface?: Interface
}

export class UIManager {
    public gameWindow
    public currentInterface
    public isInside
    public interfaces:Array<Interface>

    constructor({ gameWindow, currentInterface, isInside} : UIManagerProps) {

        this.gameWindow = gameWindow

        this.currentInterface = currentInterface

        this.isInside = isInside

        this.interfaces = []
    }

    createInterface(  ){

        const newInterface = new Interface({
           ...this.gameWindow, 
        })

        this.interfaces.push( newInterface )
        this.currentInterface = newInterface
    }
    
    clickEvent( {clientX, clientY} : MouseEvent){
        
        // console.log()
        const components = this.currentInterface?.getComponents()
        if( !components ) return
        
        const rect = new Rect({x:clientX, y:clientY, w:1, h:1})
        
        const clickedComponent = components.find(cmp => this.isInside(rect, cmp))

        if( clickedComponent ){
            clickedComponent.interact?.()
        }
    }

}





/*
import { Interface } from "./Interface.js"
import { Rect, RectProps } from "../Bases/Rect.js"

export interface UIManagerProps {
    gameWindow : Rect

    interfaces?: Array<Interface>
    currentInterface?: Interface
}

export interface UIManagerProps2  {
    gameWindow : Rect
}

export class UIManager{
    private gameWindow: Rect
    public interfaces: Array<Interface> = []
    public transitionRunning: ((ctx:CanvasRenderingContext2D, color:string) => void) | null = null
    public currentInterface : Interface | null

    constructor( { gameWindow,} : UIManagerProps  ){
        
        this.gameWindow = gameWindow
        
        this.currentInterface = null // props.currentInterface || null
        
        this.transition()
    }

    createInterface( name:string ){
        const self = this 
        const newInterface = new Interface(
           {
            ...self.gameWindow
           }
        )
    }

    transition(){

        /*
        const { x, y, w, h } = this.gameWindow 
        const blocksSize = 50

        const relativeW = w / blocksSize
        const relativeH = h / blocksSize

        const blocks:Array<Array<Array<number>>> = []

        let time = 10

        for(let x = 0; x < relativeW; x++ ){
            blocks.push([])

            for(let y = 0; y < relativeH; y++ ){
                blocks[x].push( [x, y, blocksSize ])
            }
        }

        let orientation = 1

        let size = blocksSize

        this.transitionRunning = function Animate( ctx: CanvasRenderingContext2D, color:string = 'blue'){
        

            if( time > 0 || time < 100){
                time += .1
            }

            
            size -= Math.cos( time ) * 4 // 2 * this.orientation

            // menor numero absoluto é 0.06263412436859372
            
            for(let xx = 0; xx < blocks[0].length; xx++ ){

                for(let yy = 0; yy < blocks.length; yy++ ){
                    
                    const [blockX, blockY] = blocks[yy][xx]
                    
                    const xmiddle = ((blockX * blocksSize) - size / 2) + blocksSize / 2
                    const ymiddle = ((blockY * blocksSize) - size / 2) + blocksSize / 2
                    
                    ctx.fillStyle = color
                    ctx.fillRect(xmiddle, ymiddle, size, size)
                
                }
                
            }

        }
*/
    
/*
}

    addInterface( _interface: Interface ){
        this.interfaces.push( _interface )
    }

    changeInterface( _interface:Interface, transitionEnabled: boolean ){
        if( transitionEnabled ){
            this.transition()
        }
    }

}
*/