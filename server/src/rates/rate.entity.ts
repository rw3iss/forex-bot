import {EntityBase}            from '../lib/EntityBase';
import {Column, Entity, Index} from 'typeorm';

@Entity('rates')
@Index(['name'])
export class Rate extends EntityBase {

	@Column()
	public name: string;

	@Column()
	public time: Date;

	@Column()
	public bid: number;

	@Column()
	public ask: number;

}
