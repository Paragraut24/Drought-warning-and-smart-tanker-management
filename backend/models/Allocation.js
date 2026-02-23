import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Village from './Village.js';
import Tanker from './Tanker.js';

const Allocation = sequelize.define('Allocation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  village_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Village,
      key: 'id'
    }
  },
  tanker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tanker,
      key: 'id'
    }
  },
  allocation_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  priority_score: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  estimated_delivery: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

Village.hasMany(Allocation, { foreignKey: 'village_id' });
Allocation.belongsTo(Village, { foreignKey: 'village_id' });

Tanker.hasMany(Allocation, { foreignKey: 'tanker_id' });
Allocation.belongsTo(Tanker, { foreignKey: 'tanker_id' });

export default Allocation;
