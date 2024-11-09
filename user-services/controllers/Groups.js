import { Op } from "sequelize";
import Groups from "../models/GroupModel.js";

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

// /groups [GET, POST-Create]
// /groups/:id [GET, PUT, DELETE]
// /groups/:id/addUser [POST, DELETE]
