const Package = require("../models/Package");

module.exports = async function registerPackageSlots(user) {
    await Package.create({userId: user.id, name: 'Básico', price: 100, pkgType: 'basic', qty: 5}); // quantidade de pacotes iniciais
    await Package.create({userId: user.id, name: 'Avançado', price: 100, pkgType: 'advanced', qty: 1});
    await Package.create({userId: user.id, name: 'Premium', price: 100, pkgType: 'premium', qty: 0});
    await Package.create({userId: user.id, name: 'Comum', price: 100, pkgType: 'onlyCommon', qty: 0});
    await Package.create({userId: user.id, name: 'Raro', price: 100, pkgType: 'onlyRare', qty: 0});
    await Package.create({userId: user.id, name: 'Epico', price: 100, pkgType: 'onlyEpic', qty: 0});
    await Package.create({userId: user.id, name: 'Lendário', price: 100, pkgType: 'onlyLegendary', qty: 0});
    await Package.create({userId: user.id, name: 'Mitico', price: 100, pkgType: 'onlyMitic', qty: 0});
}

