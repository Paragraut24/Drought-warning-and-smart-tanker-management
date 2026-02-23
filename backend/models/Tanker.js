import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tanker = sequelize.define('Tanker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registration_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  capacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'in liters'
  },
  status: {
    type: DataTypes.ENUM('available', 'assigned', 'in_transit', 'maintenance'),
    defaultValue: 'available'
  },
  current_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  current_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
});

export default Tanker;
