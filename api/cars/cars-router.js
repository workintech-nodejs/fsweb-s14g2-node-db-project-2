// HOKUS POKUS
const router = require("express").Router();
const carsModel = require("./cars-model");
const mw = require("./cars-middleware");

router.get("/",async(req,res,next)=>{
    try {
        const allData = await carsModel.getAll();
        res.json(allData);
    } catch (error) {
        next(error);
    }
});
router.get("/:id",mw.checkCarId, async(req,res,next)=>{
    try {
        res.json(req.existCar)
    } catch (error) {
        next(error);
    }
});
router.post("/",mw.checkCarPayload,mw.checkVinNumberValid,mw.checkVinNumberUnique, async(req,res,next)=>{
    try {
        const insertedCar = await carsModel.create(req.body);
        res.status(201).json(insertedCar);
    } catch (error) {
        next(error);
    }
});

module.exports = router;