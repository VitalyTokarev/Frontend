import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Input from '../Input';
import Button from '../Button';
import BootstrapContainer from '../BootstrapContainer';
import { checkEmptyAndLength,  validationEmail } from '../../helpers/validation';
import { useFieldsState } from '../../hooks';
import { INITIAL_TITLE_DATA } from '../../helpers/constants';

const INITIAL_FILEDS_VALUES = {
    name: '',
    email: '',
    password: '',
};

const FormUsers = ( { getData, editUser } ) => {
    const [ 
        user, 
        handleChange,
        errorsText, 
        setErrors, 
        resetFileds, 
        setUser 
    ] = useFieldsState(INITIAL_FILEDS_VALUES);

    const [ requiredPassword, setRequiredPassword ] = useState( true );  
    const [ titleData, setTitleData] = useState(INITIAL_TITLE_DATA);

    useEffect(() => {
        if (editUser) {
            const {
                _id,
                name,
                email,
                role,
                index,
            } = editUser;

            setUser({
                _id,
                name,
                email,
                role,
            });

            setRequiredPassword(false);

            setTitleData({       
                nameSubmitBtn: 'Редактировать',
                title: `Редактировать пользователя №${index + 1}`,
            });
        }
    // eslint-disable-next-line
    }, [editUser]);


    const validation = useCallback (
        () => {
            const name = checkEmptyAndLength(user.name, 'имени', 5);
            const password = checkEmptyAndLength(user.password, 'пароля', 6, requiredPassword);
            const email = validationEmail(user.email);

            setErrors({
                name,
                password,
                email,
            });

            return !name && !password && !email;
    }, [requiredPassword, setErrors, user.email, user.name, user.password]);

    const handleClearForm = useCallback( 
        () => {
            resetFileds();
            setTitleData(INITIAL_TITLE_DATA);
            setRequiredPassword(true);
    }, [resetFileds]);

    const submitAction = useCallback (
        event => {
            event.preventDefault();
            
            if ( !validation() ) {
                return;
            }

            getData( user )
            .then( successCompletion => {
                if (successCompletion) {
                    handleClearForm();
                }
            });
    }, [getData, handleClearForm, user, validation]);

    return (
        <BootstrapContainer colClasses="col-6 mx-auto">
            <form>
                <h4 className="text-center">{titleData.title}</h4>
                <Input
                    title={'Имя пользователя:'}
                    name={"name"}
                    handleChange={handleChange}
                    value={user.name}
                    errorText={errorsText.name}
                />
                <Input
                    title={'E-mail адрес пользователя:'}
                    name={"email"}
                    handleChange={handleChange}
                    value={user.email}
                    errorText={errorsText.email}
                />
                <Input
                    title={"Ввести новый пароль:"}
                    name={"password"}
                    handleChange={handleChange}
                    value={user.password}
                    errorText={errorsText.password}
                />
                <Button
                    name={titleData.nameSubmitBtn}
                    type={"submit"}
                    handleOnClick={submitAction}
                    btnClass={"btn btn-primary form-btnSubmit"}
                />
            </form>
        </BootstrapContainer>
    );
};

FormUsers.propTypes = {
    editObject: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        index: PropTypes.number,
    }), 
    getData: PropTypes.func.isRequired,
};

export default FormUsers;