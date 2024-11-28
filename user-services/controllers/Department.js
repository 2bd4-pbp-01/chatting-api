import Department from "../models/DepartmentModel.js";
import Users from "../models/UserModel.js";
import response from "../util/corparesponse.js"; 
import { Sequelize } from "sequelize";

// Get semua department (hanya operator)
export const getDepartments = async(req, res) =>{
    try {
        const departments = await Department.findAll({
            include: [{
                model: Users,
                attributes: ['username', 'email', 'tipe_user']
            }]
        });
        response(200, departments, "Semua department berhasil diambil", res);
    } catch (error) {
        response(500, null, error.message, res);
    }
}

// Get department by ID (hanya operator)
export const getDepartmentById = async(req, res) =>{
    try {
        const department = await Department.findOne({
            where: {
                id_department: req.params.id
            },
            include: [{
                model: Users,
                attributes: ['username', 'email', 'tipe_user']
            }]
        });
        if(!department) return response(404, null, "Department tidak ditemukan", res);

        const responseData = {
            id_department: department.id_department,
            nama_department: department.nama_department,
            users: department.users
        };

        response(200, responseData, "Department berhasil diambil", res);
    } catch (error) {
        response(500, null, error.message, res);
    }
}

// Create department baru (hanya operator)
export const createDepartment = async(req, res) =>{
    const {nama_department} = req.body;
    try {
        // Check if department name already exists
        const existingDepartment = await Department.findOne({
            where: {
                nama_department: nama_department
            }
        });
        if(existingDepartment) {
            return res.status(400).json({msg: "Nama department sudah ada"});
        }
        
        const newDepartment = await Department.create({
            nama_department: nama_department
        });

        const responseData = {
            id_department: newDepartment.id_department,
            nama_department: newDepartment.nama_department
        };

        response(201, responseData, "Department berhasil dibuat", res);
    } catch (error) {
        response(400, null, error.message, res);
    }
}

// Update department (hanya operator)
export const updateDepartment = async(req, res) =>{
    const department = await Department.findOne({
        where: {
            id_department: req.params.id
        }
    });
    if(!department) return response(404, null, "Department tidak ditemukan", res);
    
    const {nama_department} = req.body;
    try {
        // Check if new name already exists (excluding current department)
        const existingDepartment = await Department.findOne({
            where: {
                nama_department: nama_department,
                id_department: {
                    [Sequelize.Op.ne]: req.params.id
                }
            }
        });
        if(existingDepartment) {
            return response(400, null, "Nama department sudah ada", res);
        }

        await Department.update({
            nama_department: nama_department
        },{
            where: {
                id_department: req.params.id
            }
        });
        const updatedDepartment = await Department.findOne({
            where: {
                id_department: req.params.id
            }
        });

        const responseData = {
            id_department: updatedDepartment.id_department,
            nama_department: updatedDepartment.nama_department
        };
        response(200, responseData, "Department berhasil diupdate", res);
    } catch (error) {
        response(400, null, error.message, res);
    }
}

// Delete department (hanya operator)
export const deleteDepartment = async(req, res) =>{
    try {
        const department = await Department.findOne({
            where: {
                id_department: req.params.id
            }
        });
        if(!department) return response(404, null, "Department tidak ditemukan", res);

        // Check if department has users
        const usersInDepartment = await Users.count({
            where: {
                id_department: req.params.id
            }
        });
        
        if(usersInDepartment > 0) {
            return response(400, null, "Department memiliki user, tidak dapat dihapus", res);
        }

        await Department.destroy({
            where: {
                id_department: req.params.id
            }
        });

        const responseData = {
            id_department: department.id_department,
            nama_department: department.nama_department
        };

        response(200, responseData, "Department berhasil dihapus", res);
    } catch (error) {
       response(400, null, error.message, res);
    }
}

// Add user to department (hanya operator)
export const addUserToDepartment = async (req, res) => {
    const { id_department, id_users } = req.body;
    try {
        const department = await Department.findOne({
            where: {
                id_department: id_department
            }
        });
        if (!department) return response(404, null, "Department tidak ditemukan", res);

        const user = await Users.findOne({
            where: {
                id_users: id_users
            }
        });
        if (!user) return response(404, null, "User tidak ditemukan", res);

        if (user.tipe_user === 'operator') {
            return response(403, null, "Tidak dapat menambahkan operator ke department", res);
        }

        await Users.update({
            id_department: id_department
        }, {
            where: {
                id_users: id_users
            }
        });
        
        const responseData = {
            id_users: user.id_users,
            username: user.username,
            id_department: department.id_department,
            nama_department: department.nama_department
        };

        response(200, responseData, "User berhasil ditambahkan ke department", res);
    } catch (error) {
        //Can i do this?
        response(400, null, error.message, res);
    }
};

// Remove user from department (hanya operator)
export const removeUserFromDepartment = async (req, res) => {
    const { id_department, id_users } = req.body;
    try {
        const department = await Department.findOne({
            where: {
                id_department: id_department
            }
        });
        if (!department) return response(404, null, "Department tidak ditemukan", res);

        const user = await Users.findOne({
            where: {
                id_users: id_users
            }
        });
        if (!user) return response(404, null, "User tidak ditemukan", res);

        if (user.id_department !== id_department) {
            return response(400, null, "User tidak berada di department ini", res);
        }

        await Users.update({
            id_department: null
        }, {
            where: {
                id_users: id_users
            }
        });
        
        const responseData = {
            id_users: user.id_users,
            username: user.username,
            id_department: department.id_department,
            nama_department: department.nama_department
        };

        response(200, responseData, "User berhasil dikeluarkan dari department", res);
    } catch (error) {
        response(400, null, error.message, res);
    }
};