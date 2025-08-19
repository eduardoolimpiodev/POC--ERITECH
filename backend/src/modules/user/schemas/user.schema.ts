import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @Prop({ required: true, unique: true })
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'User full name', example: 'Eduardo Olimpio' })
  name: string;

  @Prop({ default: '' })
  @ApiProperty({ description: 'User experience description', example: 'Senior developer with 8 years experience' })
  description: string;

  @Prop({ default: null })
  @ApiProperty({ description: 'Profile image URL', example: '/uploads/profile-123.jpg' })
  profileImage: string;

  @Prop({ default: true })
  @ApiProperty({ description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
