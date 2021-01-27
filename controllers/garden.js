const {
  getGarden,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
  createAddress,
  updateAddress,
  createZonesForGardenId,
  getZonesForGardenId,
  linkZoneToPlantFamily,
  removeZonesForGardenId,
  getActionFeedForOneZone,
  getActionFeedForOneGarden,
  postActionFeedForOneZone,
} = require('../models/garden');

module.exports.handleGetActionFeedForOneZone = async (req, res) => {
  const rawData = await getActionFeedForOneZone(req.params.zoneId);
  return res.status(200).send(rawData);
};

module.exports.handleGetActionFeedForOneGarden = async (req, res) => {
  const rawData = await getActionFeedForOneGarden(req.params.gardenId);
  return res.status(200).send(rawData);
};

module.exports.handlePostActionFeedForOneZone = async (req, res) => {
  const { time, date, description, action_id } = req.body;
  // we can get the zone_id from the body as well
  const actionData = {
    time,
    date,
    description,
    action_id,
    user_id: req.currentUser.id,
    zone_id: req.params.zoneId,
  };
  const rawData = await postActionFeedForOneZone(actionData);
  return res.status(200).send(rawData);
};

module.exports.handleGetGarden = async (req, res) => {
  if (req.currentUser.is_admin === 1) {
    const rawData = await getGarden();
    return res.status(200).send(rawData);
  }
  const rawData = await getGarden(+req.currentUser.id);
  return res.status(200).send(rawData);
};

module.exports.handleGetOneGarden = async (req, res) => {
  res.send(await getOneGarden(req.params.id));
};

module.exports.handleGetZonesForOneGarden = async (req, res) => {
  res.send(await getZonesForGardenId(req.params.id));
};

module.exports.handleCreateGarden = async (req, res) => {
  console.log(req.files);
  let picture;
  let map;
  if (!req.files.gardenPicture) {
    picture = null;
  } else {
    picture = req.files.gardenPicture[0].path;
  }
  if (!req.files.zonePicture) {
    map = null;
  } else {
    map = req.files.zonePicture[0].path;
  }

  const {
    address,
    name,
    description,
    exposition,
    zone_quantity,
    max_users,
    zone_details,
  } = JSON.parse(req.body.newData);
  // Start to manage file upload here

  const dataAddress = await createAddress(address);
  const createdAddressId = dataAddress.id;
  // we don't *absolutely* need to remove the address if creating the garden fails, there will simply be a useless address in the table - it does not have foreign keys pointing to anything

  const dataGarden = await createGarden({
    address_id: createdAddressId,
    name,
    description,
    exposition,
    zone_quantity: +zone_quantity,
    max_users: +max_users,
    zone_details,
    picture,
    map,
  });
  const createdGardenId = dataGarden.id;

  if (zone_details.length > 0) {
    const dataZones = await createZonesForGardenId(
      createdGardenId,
      zone_details
    );
    const { affectedRows, firstInsertId } = dataZones;

    const zoneIdList = [];
    for (let i = 0; i < affectedRows; i += 1) {
      zoneIdList.push(firstInsertId + i);
    }
    const zoneToPlantFamilyArray = zoneIdList.map((zone, index) => {
      return {
        zoneId: zone,
        plantFamilyArray: [...zone_details[index].plantFamilyArray],
      };
    });

    const insertionStatus = []; // table looking like [true, false, true, true], if the plantFamilyArray is empty, it should just be [null, null, null]
    zoneToPlantFamilyArray.forEach(async (elem) => {
      const result = await linkZoneToPlantFamily(
        elem.zoneId,
        elem.plantFamilyArray
      );
      insertionStatus.push(result);
    });
    if (insertionStatus.includes(false)) {
      return res
        .status(409)
        .send('Problème dans la table de jointure zone-plantFamily');
    }
  }

  return res.status(201).send('Jardin créé avec succès');
};

module.exports.handleUpdateZones = async (req, res) => {
  const gardenId = req.params.id;
  const { zone_details } = req.body;

  // first we remove all the zones for this garden id
  await removeZonesForGardenId(gardenId);

  // then we re-create new zones
  if (zone_details.length > 0) {
    const dataZones = await createZonesForGardenId(gardenId, zone_details);
    const { affectedRows, firstInsertId } = dataZones;

    const zoneIdList = [];
    for (let i = 0; i < affectedRows; i += 1) {
      zoneIdList.push(firstInsertId + i);
    }
    const zoneToPlantFamilyArray = zoneIdList.map((zone, index) => {
      return {
        zoneId: zone,
        plantFamilyArray: [...zone_details[index].plantFamilyArray],
      };
    });

    const insertionStatus = []; // table looking like [true, false, true, true], if the plantFamilyArray is empty, it should just be [null, null, null]
    zoneToPlantFamilyArray.forEach(async (elem) => {
      const result = await linkZoneToPlantFamily(
        elem.zoneId,
        elem.plantFamilyArray
      );
      insertionStatus.push(result);
    });
    if (insertionStatus.includes(false)) {
      return res
        .status(409)
        .send('Problème dans la table de jointure zone-plantFamily');
    }
  }

  return res.status(200).send('Zones mises à jour avec succès');
};

module.exports.handleUpdateGarden = async (req, res) => {
  let picture = '';
  let map;
  if (!req.files.gardenPicture) {
    picture = undefined;
  } else {
    picture = req.files.gardenPicture[0].path;
  }
  if (!req.files.zonePicture) {
    map = undefined;
  } else {
    map = req.files.zonePicture[0].path;
  }

  const {
    address,
    name,
    description,
    exposition,
    zone_quantity,
    max_users,
  } = JSON.parse(req.body.newData);
  // Start to manage file upload here

  const { address_id, ...rest } = address;
  const dataAddress = await updateAddress(address.address_id, rest);
  const updatedAddressId = dataAddress.id;
  // we don't *absolutely* need to remove the address if creating the garden fails, there will simply be a useless address in the table - it does not have foreign keys pointing to anything
  const dataGarden = await updateGarden(req.params.id, {
    address_id: updatedAddressId,
    name,
    description,
    exposition,
    zone_quantity: +zone_quantity,
    max_users: +max_users,
    picture,
    map,
  });

  return res.status(200).send(dataGarden);
};

module.exports.handleDeleteGarden = async (req, res) => {
  await removeGarden(req.params.id);
  res.sendStatus(204);
};
