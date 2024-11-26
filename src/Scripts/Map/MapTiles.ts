import { Tile } from "../Tiles/Tiles.js";
import { Ground } from "../Tiles/Ground.js";
import { MapMatix } from "../Map/MapMatrix.js";

export class MapTiles extends MapMatix {
    public map: Array<Array<Tile>> = []
    public tileSize:number

    constructor( w:number, h:number, tileSize:number, mapStructure:Array<Array<number>> | null = null){
 
        super( w, h, mapStructure )

        this.tileSize = tileSize

        this.map = this.createMap( this )
    }

    createMap( { matrix, tileSize } : MapTiles ){

        const map = matrix.map( (col, indexY) => {
            
            return col.map((tileNumber, indexX) => {
                
                let tile = null

                const pos = {x: indexX * tileSize, y: indexY * tileSize, w:tileSize, h:tileSize}
                
                switch ( tileNumber ) {
                    case 1 : tile = new Ground( pos ); break;
                }

                return tile as Tile

            })

        })

        return map

    }

    static GetColorByType( type:string | null ) : string {
        
        let color = '#454545'

        switch ( type ){
            case "Ground" : color = 'green'; break;
        }

        return color 

    }

    getTiles() {

        let tiles:Array<Tile> = []

        this.map.forEach( col => {
            col.forEach( tile => tile ? tiles.push( tile ): null)
        } )                

        return tiles
        // return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
    }


/*
    render( ctx: CanvasRenderingContext2D, cam: Camera){
        
        this.map.forEach( (col, indexY) => {
            
            col.forEach( (tile, indexX) => {


                if( tile){
                    ctx.fillStyle = MapTiles.GetColorByType( tile?.type )
    
                    //const [ x, y, w, h ] = cam.calcCoords({x:indexX, y:indexY, w:this.tileSize, h:this.tileSize})
    
                    const [ w, h ] = [
                        this.tileSize * cam.zoom,
                        this.tileSize * cam.zoom
                    ]
                    
                    const x = (tile.x * w) - (cam.x * cam.zoom)
                    const y = (tile.y * h) - (cam.y * cam.zoom)
    
        
                    ctx.fillRect(x, y, w, h)

                }

            })

        })

    }
*/
}