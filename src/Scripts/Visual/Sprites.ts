// talvez tenha que mudar os frames pra dentro de cada array
export type SpriteProps = {
    name: string,
    position: Array<number>,
}

export class Sprites {
    public spriteSheet:string = ''
    public allSprites: Array<SpriteProps> = []
    public scale:number
    constructor(spriteSheet: string, scale:number = 1){
        this.spriteSheet = spriteSheet
        this.scale = scale

        this.allSprites = Sprites.GetSprites()
    }

    static GetSprites( ){

        const sprites= [
        //  ['name', [frames, x, y, w, h ]]
        
            ['player', [1, 0, 0, 21, 39 ]],

        ] 

        return sprites.map(elm => ({name: elm[0], position: elm[1] } as SpriteProps))

    }

    static async GetSpriteSheet( path: string ): Promise<HTMLImageElement>{
        const img = document.createElement('img');
        
        return new Promise( (resolve, reject) => {
            img.onload = () => resolve( img )
            img.onerror = () => reject()
            img.src = path;
        })
    }
    
    GetSpritesByName( name:string ){
        const sprite = this.allSprites.find(spr => spr.name == name)
        
        return sprite
    }


}