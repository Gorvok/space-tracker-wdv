module.exports = (sequelize, DataTypes) => {
    const Galaxy = sequelize.define('Galaxy', {
        name: DataTypes.STRING,
        size: DataTypes.INTEGER,
        description: DataTypes.TEXT
    });

    Galaxy.associate = function(models) {
        Galaxy.hasMany(models.Star, {
            foreignKey: 'galaxyId',
            as: 'stars'
        });
    };

    return Galaxy;
};