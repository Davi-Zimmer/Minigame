export type RectProps = { 
    x:number
    y:number
    w:number
    h:number
    type?: string
}

export class Rect {
    public x
    public y
    public w
    public h
    public type

    constructor( { x, y, w, h, type="rect" }: RectProps){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.type = type
    }

} 