import { Op } from "sequelize";
import Groups from "../models/GroupModel.js";
import Users from "../models/UserModel.js";
import Association from "../models/AssociationModel.js";

export const getGroups = async (_req, res) => {
  try {
    const groups = await Groups.findAll();
    res.status(200).json({ data: groups });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getGroupsById = async (req, res) => {
  const { groupId: id, groupName: name = "" } = req.params;

  try {
    const group = await Groups.findOne({
      where: {
        [Op.or]: [{ id_group: Number(id) }, { name }],
      },
      include: [
        {
          model: Users,
          attributes: ["id_users", "username", "tipe_user"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    group
      ? res.status(200).json(group)
      : res.status(404).json({ msg: `Group ${id || name} not found.` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createGroup = async (req, res) => {
  const { groupName: name } = req.body;

  try {
    const [group, created] = await Groups.findOrCreate({
      where: { name },
      defaults: {
        name,
      },
    });

    created
      ? res.status(201).json({
          msg: `Group ${group.name} berhasil dibuat.`,
        })
      : res.status(409).json({
          msg: `Grup ${group.name} dengan id ${group.id_group} sudah ada.`,
        });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateGroup = async (req, res) => {
  const { groupId: id } = req.params;
  const { groupName: name = "", newName } = req.body;

  if (!name || !newName) {
    res
      .status(400)
      .json({ msg: "Informasi untuk mengubah group tidak terpenuhi." });
    return;
  }

  console.log("update", { params: req.params, body: req.body });

  try {
    const existingGroup = await Groups.findOne({
      where: { name: newName },
    });

    if (existingGroup)
      res
        .status(400)
        .json({ msg: `Group dengan nama ${existingGroup.name} sudah ada.` });

    const newGroup = await Groups.findOne({
      where: {
        [Op.or]: [{ id_group: id }, { name }],
      },
    });

    if (newGroup) {
      await Groups.update(
        { name: newName },
        { where: { id_group: newGroup.id_group } },
      );
      res.status(200).json({ msg: "Group berhasil diubah." });
    } else {
      res.status(400).json({ msg: "Group tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  const { groupId: id, groupName: name = "" } = req.params;

  try {
    const group = await Groups.findOne({
      where: {
        [Op.or]: [{ id_group: id }, { name }],
      },
    });

    if (group) {
      await Groups.destroy({
        where: {
          [Op.or]: [{ id_group: group.id_group }, { name: group.name }],
        },
      });
      res.status(200).json({ msg: "Group berhasil dihapus." });
    } else {
      res.status(404).json({ msg: "Grup tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const addMembers = async (req, res) => {
  const { groupId: id_group } = req.params;
  const { userId: id_users } = req.body;

  try {
    const group = await Groups.findByPk(id_group);
    const account = await Users.findByPk(id_users);

    console.log("find", group, account);

    if (group && account) {
      const [memberList, created] = await Association.findOrCreate({
        where: {
          id_group,
          id_users: account.id_users,
        },
        defaults: {
          id_group,
          id_users: account.id_users,
        },
      });

      created
        ? res.status(200).json({
            msg: `Berhasil menambahkan user id '${memberList.id_users}' ke group.`,
          })
        : res.status(409).json({
            msg: `User id '${memberList.id_users}' sudah ada didalam group.`,
          });
    } else {
      res.status(404).json({ msg: "Grup/user tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const kickMembers = async (req, res) => {
  const { groupId: id_group, userId: id_users } = req.params;

  try {
    const group = await Groups.findOne({
      where: { id_group },
    });
    const user = await Users.findOne({
      where: { id_users },
    });

    if (group && user) {
      const memberList = await Association.findOne({
        where: {
          id_group: group.id_group,
          id_users: user.id_users,
        },
      });

      if (memberList) {
        await Association.destroy({
          where: {
            id_association: memberList.id_association,
          },
        });

        res.status(200).json({
          msg: `Berhasil mengeluarkan user id '${memberList.id_users}' dari group.`,
        });
      } else {
        res.status(409).json({
          msg: `User id: '${id_users}' tidak ada didalam group.`,
        });
      }
    } else {
      res.status(404).json({ msg: "Grup/user tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
