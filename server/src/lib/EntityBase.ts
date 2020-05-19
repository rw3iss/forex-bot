import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export class EntityBase {

	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@CreateDateColumn()
	public stampCreated: Date;

	@UpdateDateColumn()
	public stampUpdated: Date;

}
