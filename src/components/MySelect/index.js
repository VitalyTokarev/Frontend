import React from 'react';
import classNames from 'classnames';

import './my-select.css';
import Input from '../Input';
import Button from '../Button';
import Options from './Options';

export default class MySelect extends React.Component {    
    
    constructor(props) {
        super(props);

        this.state = {
            openOptions: false,
            optionsSelect: props.options,
            searchOptions: props.options,
            focusAppearance: false,
            valueInput: '',
            refOptions: '',
            refMySelect: '', 
            firstUpdate: false,
            styleOptions: {} 
        };
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.renderOptionsPosition);
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.renderOptionsPosition);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.openOptions && this.state.openOptions !== prevState.openOptions) {
            this.renderOptionsPosition();
        }

        if (prevProps.value !== this.props.value) {
            this.setState( {
                valueInput: this.props.value,
            } );
        }
    }

    getOptionsRef = node => {
        this.setState({
            refOptions: node,
        });
    }

    getMySelectRef = node => {
        this.setState({
            refMySelect: node,
        });
    }

    openOnBtnArrow = () => {

        if (this.state.focusAppearance === true) {
            this.setState({focusAppearance: false});
            return;
        }

        if (!this.state.openOptions) {
            this.setState({
                openOptions: true,
            });
            this.сloseOnBlurOptions();

            return;
        }
        
        this.setState({
            openOptions: false,
        });

        document.removeEventListener('click', this.outsideClickOptionsListener);

    }

    openOnFocusOptions= () => {
        this.setState({
            openOptions: true,
            focusAppearance: true,
        });

        this.сloseOnBlurOptions();
    };

    сloseOnBlurOptions = () => {
        document.addEventListener('click', this.outsideClickOptionsListener);
    }

    handleOnClickOption = value => {
        this.props.handleChangeMySelect(value);
        this.setState({openOptions: false});
        document.removeEventListener('click', this.outsideClickOptionsListener);
    }

    outsideClickOptionsListener = event => {
        if (!this.state.refOptions.contains(event.target) && !this.state.refMySelect.contains(event.target)) { 
             document.removeEventListener('click', this.outsideClickOptionsListener);
             this.setState({
                openOptions: false,
                focusAppearance:false, 
            });
        }
    }

    renderOptionsPosition = () => {
        const box = this.state.refMySelect.getBoundingClientRect();

        const boxObjects = {
            bottom: box.bottom + window.pageYOffset,
            left: box.left + window.pageXOffset,
            right: box.right + window.pageXOffset
        }

        this.setState({
            styleOptions: {
                top: boxObjects.bottom +'px',
                left: boxObjects.left +'px',
                width: boxObjects.right-boxObjects.left +'px',
            }
        });
    }

    handleChangeInput = event => {
        this.setState( {
            valueInput: event.target.value,
        });
    };

    handleSearchOptions = event => {
        const foundOptions = this.searchOptions(event.target.value, this.state.optionsSelect);
        this.setState( { searchOptions: foundOptions } );
        this.handleChangeInput(event);
    }

    searchOptions = (subString = '', arrSearch = []) => {
        const newArrOption = [];
        for(const item of arrSearch) {
            if (item.toLowerCase().search(subString.toLowerCase()) !== -1) {
                newArrOption.push(item);
            }
        }
        if (newArrOption.length === 0) {
            return arrSearch;
        }
        return newArrOption;
    };

    render = () => {
        const {
            name,
            title,
            placeholder,
            autoComplete,
            errorText, 
            classSelect,
            classLabel,
            classErrorLabel            
        } = this.props;

        const {
            openOptions,
            searchOptions,
            valueInput,
            styleOptions,
        } = this.state;

        const classArrowbtn = classNames({
            'btn-arrow': true,
            'bg-image-btn-up': !openOptions,
            'bg-image-btn-down': openOptions,
        });
        
        const classInput = classNames({
            'input': true,
            'my-select-input': true,
            'red-border': !!errorText
        });

        return (
            <React.Fragment>
                {title &&<label
                    className={classLabel ||'label-input'}
                    htmlFor={name}
                >
                    {title}
                </label>}
                <div
                    className={classSelect || 'my-select'}
                    onFocus={this.openOnFocusOptions}    
                    tabIndex="0"
                    ref={this.getMySelectRef}
                >
                    <Button
                        handleOnClick={this.openOnBtnArrow}
                        btnClass={classArrowbtn}
                        type={"button"}
                    />
                    <Input
                        name={name}
                        placeholder={placeholder}
                        handleChange={this.handleSearchOptions}
                        value={valueInput}
                        classInput={classInput}
                        autoComplete={autoComplete}
                        removePlaceForErrorText={true}
                    />
                    {openOptions && <Options
                        options={searchOptions}
                        handleChangeMySelect={this.handleOnClickOption}
                        getOptionsRef={this.getOptionsRef}
                        style={styleOptions}
                    />}
                </div>
                <label 
                    className={classErrorLabel ||'label-error'} 
                    htmlFor={name}
                > {errorText} 
                </label>
            </React.Fragment>
        )
    }
}