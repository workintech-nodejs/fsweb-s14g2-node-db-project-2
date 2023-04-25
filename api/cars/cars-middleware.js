const carsModel = require("./cars-model");
const vinValidator = require("vin-validator");

const checkCarId = async (req, res, next) => {
  // HOKUS POKUS
  try {
    const existCar = await carsModel.getById(req.params.id);
    if(!existCar){
      res.status(404).json({message:`${req.params.id} kimliğine sahip araba bulunamadı`})
    }else{
      req.existCar = existCar;
      next();
    }
  } catch (error) {
    next(error);
  }
}

const checkCarPayload = (req, res, next) => {
  // HOKUS POKUS
  try {
    const fields = ["vin","make","model","mileage"];
    let missedFields = [];
    for (let i = 0; i < fields.length; i++) {
      const item = fields[i];
      if(!req.body[item]){
        missedFields.push(item);
      }
    }
    if(missedFields.length>0){
      res.status(400).json({message:`${missedFields.toString()} ${missedFields.length==1 ? "is":"are"} missing`})
    }else{
      next();
    }

  } catch (error) {
    next(error);
  }
}

const checkVinNumberValid = (req, res, next) => {
  // HOKUS POKUS
  try {
    let isValidVin = vinValidator.validate(req.body.vin); 
    if(!isValidVin){
      res.status(400).json({message:`vin ${req.body.vin} is invalid`});
    }else{
      next()
    }
  } catch (error) {
    next(error);
  }
}

const checkVinNumberUnique =async (req, res, next) => {
  // HOKUS POKUS
  try {

    //#BEGIN KÖTÜ ÖRNEK // WORST CASE
    /*const allCars = await carsModel.getAll();
    const isExist = allCars.filter(x=>x.vin === req.body.vin)[0]; */
    
    //#END KÖTÜ ÖRNEK

    const isExistRecord = await carsModel.getByVin(req.body.vin);
    if(isExistRecord){
      res.status(400).json({message:`vin ${req.body.vin} already exists`});
    }else{
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkCarId,checkCarPayload,checkVinNumberUnique,checkVinNumberValid
}
