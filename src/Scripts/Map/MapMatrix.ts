export class MapMatix {
    public w:number
    public h:number
    public matrix: Array<Array<number | null>> = []
    
    constructor(w:number, h:number, mapStructure:Array<Array<number>> | null = null){
        if( mapStructure ){
            this.w = mapStructure[0].length
            this.h = mapStructure.length
            this.matrix = mapStructure
            
        } else {
            this.w = w
            this.h = h

            const ground = 1

            for(let y = 0; y < h - ground ; y++){
                this.matrix.push( [] )
    
                for(let x = 0; x < w ; x++){
                    
                    this.matrix[ y ].push( 0 )
    
                }
    
            }
            
            const lastCol = this.matrix.length
    
            this.matrix[ lastCol ] = Array( w ).fill( 1 )
        }
        
    }

}