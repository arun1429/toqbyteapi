const { adminEmployeesModel } = require("./module/adminEmployee/model/adminEmployee");
const { bcryptfun } = require("./helper/comFunction");


exports.createNewAdmin = async function(adminPassword) {
    try {
        const adminExist = await adminEmployeesModel.findOne({});
        if (!adminExist) {
            console.log("Admin Dont Exist, Creating New");
            // If Not Admin -- Create New Admin
            const hashedPassword = await bcryptfun(adminPassword);
            const obj = {
                empEmailID: "admin@toqbyte.com",
                empPassword: hashedPassword,
                empName: "Arun Sharma",
                profilePic: "https://res.cloudinary.com/appindia/image/upload/v1562231702/uploads/profilePic-1562231699645.png",
                typeOfAdmin: "SUPERADMIN",
                empRole: "ALL"
            };
            await new adminEmployeesModel(obj).save();
            console.log("admin data added Successfully.");
        }
        console.log("admin already created.")
    } catch (error) {
        console.log(error);
    }
};