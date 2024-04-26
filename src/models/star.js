module.exports = (sequelize, DataTypes) => {
    const Star = sequelize.define('Star', {
        name: DataTypes.STRING,
        size: DataTypes.INTEGER,
        description: DataTypes.TEXT
    });

    Star.associate = function(models) {
        Star.belongsTo(models.Galaxy, {
            foreignKey: 'galaxyId',
            as: 'galaxy'
        });
        Star.belongsToMany(models.Planet, {
            through: 'StarsPlanets',
            as: 'planets',
            foreignKey: 'starId',
            otherKey: 'planetId'
        });
    };

    return Star;
};
