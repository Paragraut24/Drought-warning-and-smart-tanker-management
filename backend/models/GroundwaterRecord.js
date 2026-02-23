import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Village from './Village.js';

const GroundwaterRecord = sequelize.define('GroundwaterRecord', {
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
  measurement_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  water_level: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'in meters below ground level'
  },
  quality_index: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'optional quality score 0-100'
  }
});

Village.hasMany(GroundwaterRecord, { foreignKey: 'village_id' });
GroundwaterRecord.belongsTo(Village, { foreignKey: 'village_id' });

export default GroundwaterRecord;
