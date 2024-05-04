// import Plate from "../model/NumberModel.js";

const Plate = require("../model/NumberModel");



exports.addEntry = async (req, res) => {
    try {
        const value = req.body;
        console.log(value);
        const exists = await Plate.findOne({ numberPlate: value.numPlate });
        if (!exists) {
            const userData = new Plate({
                numberPlate: value.numPlate,
                timeEntered: value.enterTime,
                entered: true
            });
            await userData.save();
            return res.status(200).json({ message: "Plate saved!" });
        }
        //If user is inside the parking lot and now is exiting then send enteredTime and set entered to false
        if (exists.entered) {
            const updatedUser = await Plate.findOneAndUpdate({ numberPlate: value.numPlate }, { entered: false });
            return res.status(200).json({timeEntered:exists.timeEntered,numPlate:exists.numberPlate});
        }
        //If user is outtside the parking lot and now is entering then set entered to true and set enteredTime
        else if (!exists.entered) {
            const updatedUser = await Plate.findOneAndUpdate({ numberPlate: value.numPlate }, { entered: true, timeEntered: value.enterTime });
            return res.status(200).json({ message: "Data updated!" });

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ Message: "Server error" });
    }
}

