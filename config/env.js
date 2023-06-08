const config = {
    // environment: 'dev', // enums:[dev,prod]
    environment: 'prod', // enums:[dev,prod]
    jwtSecretKey: 'H3!!0_rs_buildings_adm!n',
    sendgridToken: 'SG.wumwV0kxQFiICSZYJKPNuQ.eE21ADYOuRaynf3jgDGlMeRcGFfSZ1kdBYXAqWA8_hM', // need to be changed
    s3: {
        bucket: 'toqnkart',
        accessKeyId: 'AKIA4ZSJ5EIAI7JAAFNW',
        secretAccessKey: '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',
    },
    serverKey: 'AAAAP5N9Z8I:APA91bFygKtzsNIyYUCllr7zUuxugX0gS2grS7c2nycSrFI_X7RyvrE8TnQYGdG4gI8gPo3DCBYv_uZV6dal8YVM26qj-V4hyDiBoyaciHQeZFq-quVYKxtxhiiimQy1tpAkmta1f4aS',
    nimbusSmsKey: {
        UserID: 'toqbyte',
        Password: 'toqbyte',
        SenderID: 'toqbyte',
        entityId: '1701161356025961041'
    },
};

const mongoDbUrls = {
    dev: 'mongodb+srv://admin:5nH0IQAqzyp5d8w4@cluster0.taky6ox.mongodb.net/toqbyte_prod?retryWrites=true&w=majority',
    prod: 'mongodb+srv://admin:5nH0IQAqzyp5d8w4@cluster0.taky6ox.mongodb.net/toqbyte_prod?retryWrites=true&w=majority',
};

const DbSetUp = function () {
    return mongoDbUrls[config.environment];
};

const imageUrl = {
    dev: 'http://192.168.1.142/images/toqnkart/',
    prod: 'http://13.233.243.241/images/',
};

const imageSetUp = function () {
    return imageUrl[config.environment];
};

const saveImagePath = {
    dev: '/home/sys-42/All_workspace/images/toqnkart/',
    prod: '/home/ubuntu/images/',
};

const saveImageSetUp = function () {
    return saveImagePath[config.environment];
};

module.exports = {
    config,
    DbSetUp,
    imageSetUp,
    saveImageSetUp,
};
