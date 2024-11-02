import Department from "../models/DepartmentModel.js";
import Users from "../models/UserModel.js";

// Get semua department (hanya operator)
export const getDepartments = async(req, res) =>{
    try {
        const response = await Department.findAll({
            include: [{
                model: Users,
                attributes: ['username', 'email', 'tipe_user']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Get department by ID (hanya operator)
export const getDepartmentById = async(req, res) =>{
    try {
        const response = await Department.findOne({
            where: {
                id_department: req.params.id
            },
            include: [{
                model: Users,
                attributes: ['username', 'email', 'tipe_user']
            }]
        });
        if(!response) return res.status(404).json({msg: "Department tidak ditemukan"});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
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
        
        await Department.create({
            nama_department: nama_department
        });
        res.status(201).json({msg: "Department berhasil dibuat"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// Update department (hanya operator)
export const updateDepartment = async(req, res) =>{
    const department = await Department.findOne({
        where: {
            id_department: req.params.id
        }
    });
    if(!department) return res.status(404).json({msg: "Department tidak ditemukan"});
    
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
            return res.status(400).json({msg: "Nama department sudah ada"});
        }

        await Department.update({
            nama_department: nama_department
        },{
            where: {
                id_department: req.params.id
            }
        });
        res.status(200).json({msg: "Department berhasil diupdate"});
    } catch (error) {
        res.status(400).json({msg: error.message});
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
        if(!department) return res.status(404).json({msg: "Department tidak ditemukan"});

        // Check if department has users
        const usersInDepartment = await Users.count({
            where: {
                id_department: req.params.id
            }
        });
        
        if(usersInDepartment > 0) {
            return res.status(400).json({msg: "Department masih memiliki user, tidak dapat dihapus"});
        }

        await Department.destroy({
            where: {
                id_department: req.params.id
            }
        });
        res.status(200).json({msg: "Department berhasil dihapus"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}