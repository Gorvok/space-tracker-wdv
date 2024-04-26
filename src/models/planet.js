module.exports = (sequelize, DataTypes) => {
    const Planet = sequelize.define('Planet', {
        name: DataTypes.STRING,
        size: DataTypes.INTEGER,
        description: DataTypes.TEXT
    });

    Planet.associate = function(models) {
        Planet.belongsToMany(models.Star, {
            through: 'StarsPlanets',
            as: 'stars',
            foreignKey: 'planetId',
            otherKey: 'starId'
        });
    };

    return Planet;
};
