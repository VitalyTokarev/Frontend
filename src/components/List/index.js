import React from 'react';
import PropTypes from 'prop-types';

import ListElement from './ListElement';
import BootstrapContainer from '../BootstrapContainer';

const List = ({
    list,
    removeButtonDisabled,
    removeAction,
    editAction
}) => {

    return (
        <BootstrapContainer colClasses="col-6 mx-auto">
            <ol className={"list"}>
                { list.length ?  list.map(({_id, value, type, fruit}) => {
                        return (
                        <ListElement
                            key={_id}
                            id={_id}
                            valueItem={value + ' ' + type + ' ' + fruit}
                            removeButtonDisabled={removeButtonDisabled}
                            removeAction={removeAction}
                            editAction={editAction}
                            elemValueClasses={"list-element"}
                            btnEditClasses={"btn btn-primary list-btn-edit"}
                            btnRemoveClasses={"btn btn-primary list-btn-remove"}
                        />
                    );
                    })
                :  <p>Добавьте элементы в список!</p>
                }
            </ol>
        </BootstrapContainer>
    );
};

List.defaultProps = {
    removeButtonDisabled: false,
};

List.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired, 
            value: PropTypes.string.isRequired, 
            type: PropTypes.string.isRequired, 
            fruit: PropTypes.string.isRequired,
        })
    ).isRequired,
    removeButtonDisabled: PropTypes.bool,
    removeAction: PropTypes.func.isRequired,
    editAction: PropTypes.func.isRequired,
};

export default List;