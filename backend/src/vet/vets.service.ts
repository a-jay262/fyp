
import { NotFoundException } from '@nestjs/common';
// src/vets/vet.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vet } from './vet.entity';
import * as nodemailer from 'nodemailer';
import {  BadRequestException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class VetService {
  constructor(@InjectModel('Vet') private readonly vetModel: Model<Vet>) {}

  async findAll(): Promise<Vet[]> {
    return this.vetModel.find().exec();
  }
  async findActiveVets(): Promise<Vet[]> {
    return this.vetModel.find({ approveStatus:false }).exec();  // Filter by status 1
  }
  async findnonActiveVets(): Promise<Vet[]> {
    return this.vetModel.find({ approveStatus:true }).exec();  // Filter by status 1
  }
  async findOne(id: string): Promise<Vet> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  
    const vet = await this.vetModel.findById(id).exec();
    if (!vet) {
      throw new NotFoundException('Vet not found');
    }
    return vet;
  }

  async create(vetData: Partial<Vet>, certificate: string | null, imageUrl: string | null): Promise<Vet> {
    const vet = new this.vetModel({
      ...vetData,
      certificate,
      imageUrl,
    });
    return vet.save(); // Save the vet to MongoDB
  }
  

  async update(id: string, updateData: Partial<Vet>): Promise<Vet> {
    const vet = await this.vetModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!vet) {
      throw new NotFoundException('Vet not found');
    }
    return vet;
  }

  

  async delete(id: string): Promise<Vet> {
    const vet = await this.vetModel.findById(id); // Retrieve the document
    if (!vet) {
      throw new NotFoundException('Vet not found');
    }
    await this.vetModel.deleteOne({ _id: id }); // Use deleteOne instead of remove
    return vet;
  }
  
  
  async approve(id: string): Promise<Vet> {
    // Validate if `id` is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  
    // Find the vet and update approveStatus to true
    const vet = await this.vetModel.findByIdAndUpdate(
      id, 
      { approveStatus: true }, 
      { new: true } // Return the updated document
    );
  
    if (!vet) {
      throw new NotFoundException('Vet not found');
    }
  
    return vet;
  }

  async sendNotificationEmail(email: string, name: string, message:string) {
    console.log(nodemailer);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Access the email from the .env file
        pass: process.env.EMAIL_PASS,  // Access the password from the .env file
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation EmailAs a vet',
      text: `Notification for event Booking,
  
      Name: ${name}
      Email: ${email}
      Detail:${message}
  
      Thank you,
      The Vet Derm-X Team`,
    };
  
    await transporter.sendMail(mailOptions);
  }
  
}
