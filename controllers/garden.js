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
  const {
    address,
    name,
    description,
    exposition,
    zone_quantity,
    zone_details,
  } = req.body;

  const dataAddress = await createAddress(address);
  const createdAddressId = dataAddress.id;

  const dataGarden = await createGarden({
    address_id: createdAddressId,
    name,
    description,
    exposition,
    zone_quantity: +zone_quantity,
    zone_details,
    picture: 'testURL',
    map: 'testURL',
  });
  const createdGardenId = dataGarden.id;

  const dataZones = await createZonesForGardenId(createdGardenId, zone_details);
  const { affectedRows, firstInsertId } = dataZones;
  // par exemple, affectedRows = 2, firstInsertId = 7, du coup on veut [7,8]
  const zoneIdList = [];
  for (let i = 0; i < affectedRows; i += 1) {
    zoneIdList.push(firstInsertId + i);
  }
  // zone_details: [
  //    {
  //      zone_name: 'Zone 1',
  //     type: 'Serre',
  //   exposition: 'Sud',
  //    plantFamilyArray: [Array],
  //      description: 'Serre zone 1'
  //     },
  // {
  //      zone_name: 'Zone 2',
  //         type: 'Compost zone 2',
  //          exposition: 'Sud ouest',
  //          plantFamilyArray: [Array],
  //        description: 'Description zone 2'
  //        }
  //    ]
  const zoneToPlantFamilyArray = zoneIdList.map((zone, index) => {
    return {
      zoneId: zone,
      plantFamilyArray: [...zone_details[index].plantFamilyArray],
    };
  });

  // [{zoneId: 15, plantFamilyArray: [2,4]}, {zoneId: 16, plantFamilyArray: [5, 6]}]
  const insertionStatus = []; // tableau de type [true, false, true, true]
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
