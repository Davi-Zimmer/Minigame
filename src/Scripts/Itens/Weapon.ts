import { Camera } from "../Core/Camera.js";
import { Player } from "../Entities/Player.js";
import { Item, ItemProps } from "./Item.js";

export interface WeaponProps extends ItemProps {
    damage: number
}

export class Weapon extends Item {
    private damage: number = 0

    constructor({x, y, w, h, damage, name, description} : WeaponProps){
        super({ x, y, w, h, name, description })
        
        this.setDamage( damage )
        
    }

    activation( target: Player ){
        target.floatingText("yellow", "Arma nova" )
        target.setWeapon( this )
    }

    render(ctx: CanvasRenderingContext2D, cam: Camera, spriteSize: number, spriteSheet: HTMLImageElement): void {
        this.renderSprite(ctx, cam, spriteSize, spriteSheet, 'yellow')
    }

    getDamage() { return this.damage }
    setDamage( damage:number ) { this.damage = damage }

}
