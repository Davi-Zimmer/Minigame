import { BaseObject } from "../Bases/ObjectBase.js"
import { Rect } from "../Bases/Rect.js"

export class Camera {
    public x:number
    public y:number
    public zoom: number
    private earthquake: Function
    private earthquakeForce:number = 0

    constructor(x:number, y:number, zoom:number){
        this.x = x
        this.y = y
        this.zoom = zoom

        let pertubation = 1
        

        this.earthquake = () => {

            const intencity = pertubation * this.earthquakeForce

            const xAxis = Math.random() * intencity
            const yAxis = Math.random() * intencity

            return [ xAxis, yAxis ]         
        }
    }

    

    clamp(current:number, min:number, max:number){
        return Math.min( Math.max( current, min ), max)
    }

    calcCoords({ x, y, w, h } : Rect){
        return [
            x * this.zoom - this.x * this.zoom,
            y * this.zoom - this.y * this.zoom,
            w * this.zoom, 
            h * this.zoom, 
        ]
    }

    tick( target: BaseObject, {width, height}: HTMLCanvasElement, [maxMapW, maxMapH]:Array<number>){

       
        let newX = (target.x + target.w / 2) - (width  / 2) / this.zoom
        let newY = (target.y + target.h / 2) - (height / 2) / this.zoom

        let [ xx, yy ] = this.earthquake()

        this.x = this.clamp( newX, 0, maxMapW - innerWidth  ) + xx
        this.y = this.clamp( newY, 0, maxMapH - innerHeight ) + yy
    }

    /// criar metodo de perseguição pro player aqui

    setEarthquakeForce(n:number) { this.earthquakeForce = n}
    getEarthquakeForce() { return this.earthquakeForce}

}