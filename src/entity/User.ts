import { IsEmail} from "class-validator";
import { Entity,Column,BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinTable, ManyToOne, JoinColumn, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Role } from "./Role";


@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    userId:string;
    
    @Column({unique:true})
    @IsEmail()
    email:string;

    @Column({
        nullable:true
    })
    firstName: string;

    @Column({
        nullable:true
    })
    lastName:string;
  
    @Column({
        nullable:true,
    })    
    phone: string;

    @Column({
        nullable:true
    })
    country :string; 

    @Column({
        nullable:true
    })
    state: string;

    @Column({
        nullable:true
    })
    city: string;    
   
    @ManyToMany(() => Role, role => role.users,{
        eager:true,
        cascade:true
    })
    @JoinTable({name:"user_roles"})
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
    
    @DeleteDateColumn()
    deletedAt: Date;

}

