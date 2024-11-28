import User from "../models/UserModel.js";
import response from "../util/corparesponse.js";

export const verifyUser = async (req, res, next) =>{
    if(!req.session.userId){
        return response(401, null, "Token tidak ditemukan", res);
    }
    const user = await User.findOne({
        where: {
            id_users: req.session.userId
        }
    });
    if(!user) return response(404, null, "User tidak ditemukan", res);
    req.userId = user.id_users;
    req.tipe_user = user.tipe_user;
    next();
}



export const operatorOnly = async (req, res, next) =>{
    const user = await User.findOne({
        where: {
            id_users: req.session.userId
        }
    });
    if(!user) return response(404, null, "User tidak ditemukan", res);
    if(user.tipe_user !== "operator") return res.status(403).json({msg: "Akses terlarang, hanya operator yang diizinkan"});
    next();
}