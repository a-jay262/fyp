// src/user/user.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  // Function to send OTP email
  private async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER,  // Access the email from the .env file
        pass: process.env.EMAIL_PASS,  // Access the password from the .env file
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Replace with your email
      to: email,
      subject: process.env.EMAIL_SUBJECT,
      text: `Hi, We received a request to sign in to V-DermX using this email address. If you want to proceed, use this confirmation code:
      
      ${otp}

      If you did not request this, please ignore this email.

      Thank you,
      The V-DermX Team`

    };

    await transporter.sendMail(mailOptions);
  }
  async signupvet(username: string, email: string, password: string): Promise<User> {
    const existingVet = await this.userModel.findOne({ email });

    if (existingVet) {
      throw new Error('Vet with this email already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new vet without OTP, OTP will be null for vets
    const newVet = new this.userModel({
      username,
      email,
      password:hashedPassword, // Ensure you hash the password before saving
      otp: 12, // No OTP for vets
      otpExpires: null, // No expiration since no OTP is generated
      verified: true,
    });

    await newVet.save();
    return newVet;
  }
  async verifyVetById(id: string): Promise<User> {
    const vet = await this.userModel.findById(id);

    if (!vet) {
      throw new Error('Vet not found');
    }

    // Update verified status to true
    vet.verified = true;

    await vet.save(); // Save the updated vet record
    return vet; // Return the updated vet
  }
  async signup(username: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        throw new BadRequestException('Email already exists');
      }

      // Check if the OTP has expired
      if (existingUser.otpExpiresAt && new Date() > existingUser.otpExpiresAt) {
        // Generate new OTP and update expiration time
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);

        // Update the unverified user with new OTP and expiration time
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;
        await this.sendOtpEmail(email, otp);

        return existingUser.save();
      }

      throw new BadRequestException('Please verify your email to complete signup');
    }

    // Check if username is already taken
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiration time
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);

    // Create the user as unverified
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      verified: false, // Mark as unverified
    });

    // Send OTP email
    await this.sendOtpEmail(email, otp);

    return user.save();
  }


  async verifyOtp(email: string, otp: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.verified) {
      throw new BadRequestException('User already verified');
    }

    if (user.otp !== otp || new Date() > user.otpExpiresAt) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark the user as verified
    user.verified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return user; // Return the updated user object
  }


  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.verified) {
      throw new BadRequestException('User is already verified.Try Log In');
    }

    // Generate new OTP and expiration time
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);

    // Update the user with the new OTP and expiration time
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP email
    await this.sendOtpEmail(email, otp);

    return { message: 'A new OTP has been sent to your email' };
  }


  async login(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }



    return user; // Return the user if login is successful
  }
}