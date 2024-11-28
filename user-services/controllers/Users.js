import User from "../models/UserModel.js";
import argon2 from "argon2";
import responses from "../util/corparesponse.js";    

// Get semua user (kecuali operator)
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['id_users','username','email','tipe_user'],
            where: {
                tipe_user: ['anggota', 'manager'] // Hanya ambil anggota dan manager
            }
        });
        responses(200, response, "Semua data users berhasil diambil", res);
    } catch (error) {
        responses(500, null, error.message, res);
    }
}

// Get user by ID (kecuali operator)
export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['id_users','username','email','tipe_user'],
            where: {
                id_users: req.params.id
            }
        });
        if(!response) return responses(404, null, "User tidak ditemukan", res);
        
        // Cek apakah user yang dicari adalah operator
        if(response.tipe_user === 'operator') {
            return responses(403, null, "Tidak dapat mengambil data operator", res);
        }
        responses(200, response, "Data user berhasil diambil", res);
    } catch (error) {
        responses(500, null, error.message, res);
    }
}

// Create user baru (hanya bisa buat anggota)
export const createUser = async(req, res) =>{
    const {username, email, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    
    try {
        // Cek email sudah terdaftar
        const existingUser = await User.findOne({
            where: { email: email }
        });
        if(existingUser) {
            return responses(404, null, "Email sudah terdaftar", res);
        }

        const hashPassword = await argon2.hash(password);
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            tipe_user: "anggota" // Operator hanya bisa membuat anggota
        });

        const userData = {
            id: newUser.id_users,
            username: newUser.username,
            email: newUser.email,
            tipe_user: newUser.tipe_user
        };

        // res.status(201).json({msg: "Register Berhasil"});
        responses(201, userData, "User telah berhasil dibuat", res);
    } catch (error) {
        responses(400, null, error.message, res);
    }
}

// Update user (dengan batasan role)
export const updateUser = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return responses(404, null, "User tidak ditemukan", res);

        // Cek jika user yang akan diupdate adalah operator
        if(user.tipe_user === 'operator') {
            return responses(403, null, "Tidak dapat mengubah data operator", res);
        }

        const {username, email, tipe_user} = req.body;

        // Validasi tipe_user yang diperbolehkan
        if(tipe_user && !['anggota', 'manager'].includes(tipe_user)) {
            return responses(400, null, "Tipe user tidak valid", res);
        }

         // Update tanpa mengubah password
         await User.update({
            username: username,
            email: email,
            tipe_user: tipe_user
        }, {
            where: {
                id_users: user.id_users
            }
        });
        
        // Fetch the updated user data
        const updatedUser = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });

        const userData = {
            id: updatedUser.id_users,
            username: updatedUser.username,
            email: updatedUser.email,
            tipe_user: updatedUser.tipe_user
        };
        responses(200, userData, "User Updated", res);
    } catch (error) {
        responses(400, null, error.message, res);
    }
}

// Update password user
export const updatePassword = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) responses(404, null, "User tidak ditemukan", res);

        // Cek jika user yang akan diupdate adalah operator
        if(user.tipe_user === 'operator') {
            return responses(403, null, "Tidak dapat mengubah password operator", res);
        }

        const {password, confPassword} = req.body;
        if(!password) return res.status(400).json({msg: "Password harus diisi"});
        if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});

        const hashPassword = await argon2.hash(password);

        await User.update({
            password: hashPassword
        },{
            where:{
                id_users: user.id_users
            }
        });
        
        // Fetch the updated user data
        const updatedUser = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });

        const userData = {
            id: updatedUser.id_users,
            username: updatedUser.username,
            email: updatedUser.email,
        };
        responses(200, userData, "Password Updated", res);
    } catch (error) {
        responses(400, null, error.message, res);
    }
}

// Delete user (tidak bisa delete operator)
export const deleteUser = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return responses(404, null, "User tidak ditemukan", res);

        // Cek jika user yang akan dihapus adalah operator
        if(user.tipe_user === 'operator') {
            return responses(403, null, "Tidak dapat menghapus operator", res);
        }

        await User.destroy({
            where:{
                id_users: user.id_users
            }
        });

        const userData = {
            id: user.id_users,
            username: user.username,
            email: user.email,
            tipe_user: user.tipe_user
        };
        
        responses(200, userData, "User Deleted", res);
    } catch (error) {
        responses(400, null, error.message, res);
    }
}

// Promote user menjadi manager
export const promoteToManager = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return responses(404, null, "User tidak ditemukan", res);

        // Hanya bisa promote anggota
        if(user.tipe_user !== 'anggota') {
            return (responses(400, null, "Hanya anggota yang dapat dipromosikan menjadi manager", res));
        }

        await User.update({
            tipe_user: "manager"
        },{
            where:{
                id_users: user.id_users
            }
        });
        
       responses(200, user, "Anggota berhasil dipromosikan menjadi manager", res);
    } catch (error) {
       responses(400, null, error.message, res);
    }
}

// Demote manager menjadi anggota
export const demoteToMember = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return responses(404, null, "User tidak ditemukan", res);

        // Hanya bisa demote manager
        if(user.tipe_user !== 'manager') {
            return responses(400, null, "Hanya manager yang dapat diturunkan menjadi anggota", res);
        }

        await User.update({
            tipe_user: "anggota"
        },{
            where:{
                id_users: user.id_users
            }
        });
        responses(200, user, "Manager berhasil diturunkan menjadi anggota", res);
    } catch (error) {
        responses(400, null, error.message, res);
    }
}