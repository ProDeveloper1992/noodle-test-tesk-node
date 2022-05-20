import React, { Component } from 'react'
import toastr from 'cogo-toast';
import Create from './Create'
import Edit from './Edit'
import axios from 'axios'

class Index extends Component {
    constructor() {
        super();
        this.state = {
            glossary: [],
            editUser: {}
        }
        this.handleUpdateState = this.handleUpdateState.bind(this);
    }

    componentDidMount() {
        this.handleUpdateState()
    }

    async handleUpdateState() {
        try{
            const response = await axios.get('http://localhost:8090/api/glossary/getAllGlossary')
            this.setState({ glossary: response.data.data })
        }catch (e){
            e.response.data.error.map(err => {
                toastr.error(err, { position: 'top-right', heading: 'Done' });
            })
        }

    }

    handleEditUser(glossId) {
        this.setState({
            editUser: this.state.glossary.find(x => x._id === glossId)
        })
    }

    async handleDeleteUser(id) {
        try{
            const response = await axios.delete('http://localhost:8090/api/glossary/delete/' + id)
            toastr.success(response.data.message, { position: 'top-right', heading: 'Done' });
            this.handleUpdateState()
        }catch (e){
            e.response.data.error.map(err => {
                toastr.error(err, { position: 'top-right', heading: 'Error' });
            })
        }


    }

    render() {
        return (
            <div className="card mt-4">
                <div className="card-header">
                    <h4 className="card-title"> Glossary </h4>
                    <button type="button" className="btn btn-primary btn-sm pull-right" data-toggle="modal"
                            data-target="#addModal"> Add Glossary
                    </button>
                </div>
                <div className="card-body">
                    <div className="col-md-12">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th> Id</th>
                                <th> Term</th>
                                <th> Definition</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.glossary.map((glossary, i) => (
                                <tr key={i}>
                                    <td> {i+1} </td>
                                    <td> {glossary.term} </td>
                                    <td> {glossary.definition} </td>
                                    <td>
                                        <button className="btn btn-info btn-sm mr-2"
                                                onClick={this.handleEditUser.bind(this, glossary._id)}
                                                data-toggle="modal"
                                                data-target="#editModal"> Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm"
                                                onClick={this.handleDeleteUser.bind(this, glossary._id)}> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Create updateState={this.handleUpdateState}/>
                <Edit updateState={this.handleUpdateState} user={this.state.editUser}/>
            </div>
        )
    }
}

export default Index
