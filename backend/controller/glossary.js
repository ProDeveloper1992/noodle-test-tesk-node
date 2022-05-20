const func = require('../utilites/sendResponse');
const HTTPStatusCode = require('http-status-code');
const { validateGlossary } = require('../validations/validateGlossary')
const Glossary = require('../models/Glossary')

exports.addGlossary = async (req, res) => {
    try {

        const { errors, isValid } = validateGlossary(req.body)
        const { term = "", definition } = req.body
        if (!isValid) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, errors)
            return;
        }

        const termExist = await Glossary.exists({ term: term })

        if (termExist) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, ["Term name already exists"])
            return;
        }

        const glossaryData = new Glossary({
            term: term, definition: definition
        })

        await glossaryData.save()

        func.sendSuccessData('', ["Glossary added successful"], res, 200);
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            let errors = [];

            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });

            return func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, errors);

        }
        return func.sendErrorMessage(HTTPStatusCode.getMessage(500, 'HTTP/1.1'), res, 500, [constant.Errormessage.InternalServerError]);
    }
}

exports.editGlossary = async (req, res) => {
    try {
        const { errors, isValid } = validateGlossary(req.body)
        const { term = "", definition } = req.body
        const { glossId } = req.params
        if (!isValid) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, errors)
            return;
        }

        const termExist = await Glossary.exists({ _id: { $ne: glossId }, term: term })

        if (termExist) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, ["Term name already exists"])
            return;
        }

        const glossaryExists = await Glossary.exists({ _id: glossId })

        if (!glossaryExists) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(404, 'HTTP/1.1'), res, 404, ["Glossary not found"])
            return;
        }

        await Glossary.findOneAndUpdate({ _id: glossId }, {
            $set: {
                term: term,
                definition: definition
            }
        })

        func.sendSuccessData('', ["Glossary updated successful"], res, 200);
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            let errors = [];

            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });

            return func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, errors);

        }
        return func.sendErrorMessage(HTTPStatusCode.getMessage(500, 'HTTP/1.1'), res, 500, [constant.Errormessage.InternalServerError]);
    }
}
exports.getAllGlossary = async (req, res) => {
    try {
        const glossary = await Glossary.find();

        if (glossary.length === 0) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(404, 'HTTP/1.1'), res, 404, ["Glossary not found"])
            return;
        }

        func.sendSuccessData(glossary, ["Glossary updated successful"], res, 200);
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            let errors = [];

            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });

            return func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, errors);

        }
        return func.sendErrorMessage(HTTPStatusCode.getMessage(500, 'HTTP/1.1'), res, 500, [constant.Errormessage.InternalServerError]);
    }
}

exports.deleteGlossary = async (req, res) => {
    try {
        const { glossId } = req.params

        const glossaryExists = await Glossary.exists({ _id: glossId })

        if (!glossaryExists) {
            func.sendErrorMessage(HTTPStatusCode.getMessage(404, 'HTTP/1.1'), res, 404, ["Glossary not found"])
            return;
        }

        await Glossary.findOneAndRemove({ _id: glossId })

        func.sendSuccessData('', ["Glossary deleted successful"], res, 200);
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            let errors = [];

            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });

            return func.sendErrorMessage(HTTPStatusCode.getMessage(400, 'HTTP/1.1'), res, 400, errors);

        }
        return func.sendErrorMessage(HTTPStatusCode.getMessage(500, 'HTTP/1.1'), res, 500, [constant.Errormessage.InternalServerError]);
    }
}
