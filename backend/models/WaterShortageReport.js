import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Village from './Village.js';

const WaterShortageReport = sequelize.define('WaterShortageReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  village_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Village,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('pending', 'acknowledged', 'resolved'),
    defaultValue: 'pending'
  }
});

Village.hasMany(WaterShortageReport, { foreignKey: 'village_id' });
WaterShortageReport.belongsTo(Village, { foreignKey: 'village_id' });

export default WaterShortageReport;
