import React from 'react';

import FormToDo from '../../components/FormToDo';
import List from '../../components/List';
import { AuthContext } from '../../context/Auth';
import Header from '../../components/Header';
import { getEditElement, removeElementFromArray, getEditArray} from '../../helpers/arrayMethods';

export default class Home extends React.Component {
    state = {
            list: [],
            removeButtonDisabled: false,
            editObject: null,
    };

    static contextType = AuthContext;

    componentDidMount = () => {
        this.getObjectsFromServer();
    };

    getObjectsFromServer = async () => {
        if ( !await this.context.checkAuthToken() ) { return; }

        const response = await fetch('/object');

        if (response.ok) { 
            const objects = await response.json();
            
            this.setState({
                list: objects,
            });  
            
            return;
        } 

        if (response.status === 403) {
            this.context.logout();
        }

    };

    addObjectToServer = async object => {
        if ( !await this.context.checkAuthToken() ) { return; }

        const response = await fetch('/object/create', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        });
        if (response.ok) {
            const idObject = await response.json();

            this.addObjectToLocalState(object, idObject);
            return true;
        }

        if (response.status === 403) {
            this.context.logout();
        }

        return false;
    };

    editObjectToServer = async object => {
        if ( !await this.context.checkAuthToken() ) { return; }

        const response = await fetch('/object/update', { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        });
        if (response.ok) {
            this.editObjectFromLocalState(object);
            return true;
        }

        if (response.status === 403) {
            this.context.logout();
        }

        //this.callNotification("Ошибка HTTP: " + response.status);
        return false;
    };

    deleteObjectFromServer = async id => {
        if ( !await this.context.checkAuthToken() ) { return; }

        const response = await fetch('/object/delete', { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        });
        if (response.ok) {
            
            this.removeObjectFromLocalState(id);
            return true;
        }

        if (response.status === 403) {
            this.context.logout();
        }

        //this.callNotification("Ошибка HTTP: " + response.status);
        return false;

    };

    addObjectToLocalState = (object, _id) => {
        const {
            value,
            type,
            fruit,
        } = object;

        this.setState( prevState => ({ list :
            [...prevState.list, {
                _id,
                value,
                type,
                fruit,
            }
            ],
        }));
    }
   
    editObjectFromLocalState = (object) => {
        const objectList = getEditArray(object, '_id', this.state.list);

        this.setState({
            list: objectList,
            removeButtonDisabled: false,
            editObject: null,
        });
    }

    removeObjectFromLocalState = id => {
        const listObject = removeElementFromArray(id, '_id', this.state.list);

        this.setState({
            list: listObject,
        });
    }

    getIdEditObjecId = id => {
        const editObject = getEditElement(id, '_id', this.state.list);

        this.setState({
            removeButtonDisabled: true,
            editObject,
        });
    };

    getData = object => {
        if (this.state.editObject !== null) {
            return this.editObjectToServer(object);
        } else {
            return this.addObjectToServer(object);
        }
    };

    render = () => {
        const {
            list,
            removeButtonDisabled,
            editObject,
        } = this.state;

        return (
            <React.Fragment>
                <Header 
                    history={this.props.history}
                />
                <FormToDo
                    getData={this.getData}
                    editObject={editObject}
                />
                <List
                    list={list}
                    removeAction={this.deleteObjectFromServer}
                    editAction={this.getIdEditObjecId}
                    removeButtonDisabled={removeButtonDisabled}
                />
            </React.Fragment>
        );
    };
}