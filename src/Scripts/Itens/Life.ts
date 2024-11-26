import { Camera } from "../Core/Camera.js";
import { Player } from "../Entities/Player.js";
import { Item, ItemProps } from "./Item.js";

export interface LifeProps extends ItemProps {

}

export class Life extends Item {
    private lifeStored: number = 0

    constructor({x, y, w, h, name, description} : LifeProps){
        super({ x, y, w, h, name, description })
        
        let life =  Math.floor(Math.random() * 100) + 70

        if( life === 105) { life = 200 } else
        if( life === 106) { life = 300 }

        this.setLifeStored( life )
    }

    getLifeStored() { return this.lifeStored }

    setLifeStored( lifeStored:number ) { this.lifeStored = lifeStored }

    activation( player: Player ){
        const playerLife = player.getLife()
        const itemLifeStored = this.getLifeStored() 

        player.setLife( playerLife + itemLifeStored )
        
        player.floatingText("lime", `+ ${itemLifeStored}HP`)
    }


    render(ctx: CanvasRenderingContext2D, cam: Camera, spriteSize: number, spriteSheet: HTMLImageElement): void {
        
        this.renderSprite(ctx, cam, spriteSize, spriteSheet, 'lime')

    }

}
