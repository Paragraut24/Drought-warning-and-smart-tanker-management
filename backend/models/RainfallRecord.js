import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Village from './Village.js';

const RainfallRecord = sequelize.define('RainfallRecord', {
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
  record_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  rainfall_mm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'rainfall in millimeters'
  },
  is_historical: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'true for historical averages'
  }
});

Village.hasMany(RainfallRecord, { foreignKey: 'village_id' });
RainfallRecord.belongsTo(Village, { foreignKey: 'village_id' });

export default RainfallRecord;
