module.exports = (sequelize, DataTypes) => {
    const starsPlanets = sequelize.define('StarsPlanets', {
        starId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Stars',
                key: 'id'
            }
        },
        planetId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Planets',
                key: 'id'
            }
        }
    }, {
        timestamps: false
    });

    return starsPlanets;
};
