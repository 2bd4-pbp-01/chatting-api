import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    const user = await User.findOne({
        where: {
            id_users: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    req.userId = user.id_users;
    req.tipe_user = user.tipe_user;
    next();
}

// export const adminOnly = async (req, res, next) =>{
//     const user = await User.findOne({
//         where: {
//             id_users: req.session.userId
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
//     if(user.tipe_user !== "admin") return res.status(403).json({msg: "Akses terlarang"});
//     next();
// }

export const operatorOnly = async (req, res, next) =>{
    const user = await User.findOne({
        where: {
            id_users: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    if(user.tipe_user !== "operator") return res.status(403).json({msg: "Akses terlarang, hanya operator yang diizinkan"});
    next();
}