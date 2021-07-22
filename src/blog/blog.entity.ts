import { Role } from "src/enum/role.enum";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
class Blog{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar", length: 1024})
    title : string;

    @Column({type:"varchar", length: 1024})
    fid : string;

    @Column({type:'text'})
    desc: string

    @Column({type:'text'})
    image: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}

export default Blog;