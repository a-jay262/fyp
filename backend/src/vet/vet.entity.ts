import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  qualification: string;

  @Column()
  certificate: string; // File path or URL to the certificate

  @Column()
  contact: string;

  @Column()
  area: string;


  @Column({ nullable: true })
  imageUrl: string; // URL to vet's profile image

  @Column({ default: false })
  approveStatus: boolean; // Approval status
}