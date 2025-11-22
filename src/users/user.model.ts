// src/users/user.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

// IMPORTANT: Use 'import type' for all type-only imports
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({ tableName: 'users' })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare oauthProvider: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare oauthId: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare avatarUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare refreshToken?: string | null;

  @Column({
  type: DataType.TEXT,
  allowNull: true,
})
declare googleRefreshToken?: string | null;

}
