import { Role } from "src/enum/role.enum";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
class Profile{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text'})
    uid: string
    
    @Column({type:"varchar", length: 200})
    name : string;

    @Column({type:'timestamp', default: null})
    dob: Date;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}

export default Profile;