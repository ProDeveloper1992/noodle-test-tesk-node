const validator = require('validator')
const isEmpty = require('./isEmpty')

exports.validateGlossary = (data, isTemp = true) => {
    let errors = []
    data.term = !isEmpty(data.term) ? data.term : ""
    data.definition = !isEmpty(data.definition) ? data.definition : ""

    if (validator.isEmpty(data.term)) {
        errors.push("Glossary term is required")
    }

    if (validator.isEmpty(data.definition)) {
        errors.push("Glossary definition is required")
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
