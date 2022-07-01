const mongoose = require('mongoose')

const specializationSpecificPrescriptionSchema = new mongoose.Schema({
    date_issued: { type: Date, required: true },
    prescription_url: [String]
})

const arrayOfPrescriptionsSchema = new mongoose.Schema({
    specialization: { type: String, required: true },
    specializationSpecificPrescription: [specializationSpecificPrescriptionSchema]
})

const PrescriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    prescriptions: [arrayOfPrescriptionsSchema]
})

var Prescriptions = mongoose.model('Prescription', PrescriptionSchema)

module.exports = Prescriptions