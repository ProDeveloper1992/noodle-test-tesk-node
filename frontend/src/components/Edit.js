import React, { Component } from 'react'
import toastr from 'cogo-toast';
import axios from "axios";

class Edit extends Component {
    constructor() {
        super();
        this.state = {
            errors: [],
            id: '',
            term: '',
            definition: '',
        }
        this.baseState = this.state
        this.hasErrorFor = this.hasErrorFor.bind(this);
        this.renderErrorFor = this.renderErrorFor.bind(this);
        this.handleUpdateUser = this.handleUpdateUser.bind(this);
        this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    }

    UNSAFE_componentWillReceiveProps(user_data) {
        console.log(user_data)
        this.setState({
            id: user_data.user._id,
            definition: user_data.user.definition,
            term: user_data.user.term
        })
    }

    handleInputFieldChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async handleUpdateUser(e) {
        e.preventDefault()
        const data = {
            term: this.state.term,
            definition: this.state.definition,
        }
        if (!this.checkValidation(data)) {
            try {
                const response = await axios.put('http://localhost:8090/api/glossary/edit/' + this.state.id, data);
                this.reset();
                this.props.updateState();
                document.getElementById("closeEditModal").click();
                toastr.success(response.data.message, { position: 'top-right', heading: 'Done' });

            } catch (e) {
                e.response.data.error.map(err => {
                    toastr.error(err, { position: 'top-right', heading: 'Error' });
                })
            }
        }
    }

    checkValidation(fields) {
        var error = {};
        if (fields.term.length === 0) {
            error.term = ['This field is required!'];
        }
        if (fields.definition.length === 0) {
            error.definition = ['This field is required!'];
        }
        this.setState({
            errors: error
        })
        if (fields.term.length === 0 || fields.definition.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    reset() {
        this.setState(this.baseState);
    }

    hasErrorFor(fieldName) {
        return !!this.state.errors[fieldName];
    }

    renderErrorFor(fieldName) {
        if (this.hasErrorFor(fieldName)) {
            return (
                <em className="error invalid-feedback"> {this.state.errors[fieldName][0]} </em>
            )
        }
    }

    render() {
        return (
            <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Glossary Information</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={this.handleUpdateUser}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="term" className="col-form-label">Term:</label>
                                    <input type="text"
                                           className={`form-control form-control-sm ${this.hasErrorFor('term') ? 'is-invalid' : ''}`}
                                           id="username" name="term" placeholder="Term"
                                           onChange={this.handleInputFieldChange} value={this.state.term}/>
                                    {this.renderErrorFor('term')}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="definition" className="col-form-label">Definition:</label>
                                    <input type="text"
                                           className={`form-control form-control-sm ${this.hasErrorFor('definition') ? 'is-invalid' : ''}`}
                                           id="definition" name="definition" placeholder="Definition"
                                           onChange={this.handleInputFieldChange} value={this.state.definition}/>
                                    {this.renderErrorFor('definition')}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id="closeEditModal" className="btn btn-secondary btn-sm"
                                        data-dismiss="modal">Close
                                </button>
                                <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Edit
