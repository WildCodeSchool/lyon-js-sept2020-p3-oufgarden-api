const {
  getGarden,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
  createAddress,
  createZonesForGardenId,
  linkZoneToPlantFamily,
} = require('../models/garden');

module.exports.handleGetGarden = async (req, res) => {
  const rawData = await getGarden();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneGarden = async (req, res) => {
  res.send(await getOneGarden(req.params.id));
};

module.exports.handleCreateGarden = async (req, res) => {
  console.log(req.files);
  const picture = req.files.gardenPicture
    ? req.files.gardenPicture[0].path
    : null;
  const map = req.files.zonePicture ? req.files.zonePicture[0].path : null;

  // exemple de ce qui est envoyé côté back office
  // {
  //   address: {
  //     address_city: ,
  //     address_street: ,
  //     address_zipcode: ,
  //   },
  //   name: ,
  //   description: ,
  //   exposition: ,
  //   zone_quantity: ,
  //   zone_details: [
  //     {
  //       zone_name: '',
  //       type: '',
  //       exposition: '',
  //       plantFamilyArray: [],
  //       description: '',
  //     },
  //     {
  //       zone_name: '',
  //       type: '',
  //       exposition: '',
  //       plantFamilyArray: [],
  //       description: '',
  //     },
  //   ],
  // }
  // JSON.parse is used  here to retrieve nested Object in formdata
  const {
    address,
    name,
    description,
    exposition,
    zone_quantity,
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

    // [{zoneId: 15, plantFamilyArray: [2,4]}, {zoneId: 16, plantFamilyArray: [5, 6]}]

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

module.exports.handleUpdateGarden = async (req, res) => {
  const { name } = req.body;
  const data = await updateGarden(req.params.id, {
    name,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteGarden = async (req, res) => {
  await removeGarden(req.params.id);
  res.sendStatus(204);
};
