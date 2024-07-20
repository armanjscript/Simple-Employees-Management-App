const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "employees.db"
});

const Employee = sequelize.define(
    'Employee',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        firstname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        lastname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },
    {
        tableName: 'employees',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
);
sequelize.sync();
module.exports = {Employee};

