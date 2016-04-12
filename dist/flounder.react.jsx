/*!
 * Flounder React JavaScript Stylable Selectbox v0.0.3
 * https://github.com/sociomantic-tsunami/flounder-react
 *
 * Copyright 2015-2016 Sociomantic Labs and other contributors
 * Released under the MIT license
 * https://github.com/sociomantic-tsunami/flounder-react/license
 *
 * Date: Tue Apr 12 2016
 * "This, so far, is the best React Flounder ever"
 */

/* jshint globalstrict: true */
'use strict';

import React, { Component } from 'react';
import ReactDOM             from 'react-dom';
import Flounder             from 'flounder/src/core/flounder';
import classes              from 'flounder/src/core/classes';
import utils                from 'flounder/src/core/utils';
import Search               from 'flounder/src/core/search';
import version              from 'flounder/src/core/version';
import { setDefaultOption } from 'flounder/src/core/defaults';

const slice = Array.prototype.slice;

class FlounderReact extends Component
{
    /**
     * available states
     *
     * @return _Array_ available states
     */
    allStates()
    {
        return [
            'default'
        ];
    }


    /**
     * ## componentDidMount
     *
     * setup to run afte rendering the dom
     *
     * @return _Void_
     */
    componentDidMount()
    {
        let refs            = this.refs;

        this.target         = this.originalTarget = refs.wrapper.parentNode;

        refs.data           = slice.call( refs.optionsList.children, 0 );
        refs.selectOptions  = slice.call( refs.select.children, 0 );

        refs.flounder.flounder = this.originalTarget.flounder = this.target.flounder = this;

        let multiTagWrapper = refs.multiTagWrapper;

        if ( !this.multiple )
        {
            refs.select.removeAttribute( 'multiple' );
        }

        let { isOsx, isIos, multiSelect } = utils.setPlatform();
        this.isOsx          = isOsx;
        this.isIos          = isIos;
        this.multiSelect    = multiSelect;

        this.onRender();

        try
        {
            this.onComponentDidMount();
        }
        catch( e )
        {
            console.log( 'something may be wrong in "onComponentDidMount"', e );
        }
    }


    /**
     * sets the initial state
     *
     * @return _Void_
     */
    constructor( props )
    {
        super( props );
        this.state = {
            modifier        : '',
            errorMessage    : ''
        };
    }


    /**
     * Callback to handle change.
     *
     * Also updates div state and classes
     *
     * @param  _Object_ e Event object
     */
    handleChange( e )
    {
        if ( this.props.onChange )
        {
            this.props.onChange( e );
        }
    }


    /**
     * ## prepOptions
     *
     * double checks that the options are correctly formatted
     *
     * @param {Array} _options array object that may contain objects or strings
     *
     * @return _Array_ correctly formatted options
     */
    prepOptions( data )
    {
        data.forEach( ( dataObj, i ) =>
        {
            if ( typeof dataObj === 'string' )
            {
                dataObj = {
                    text    : dataObj,
                    value   : dataObj
                };
            }

            dataObj.text = this.allowHTML ? dataObj.text : utils.escapeHTML( dataObj.text );
        } );

        return data;
    }


    /**
     * Spits out our markup
     *
     * REACT FLOUNDER CAN NOT MOUNT TO INPUT OR SELECT TAGS.
     *
     */
    render( e )
    {

        this.bindThis();

        this.initializeOptions();

        if ( this.search )
        {
            this.search = new Search( this );
        }

        try
        {
            this.onInit();
        }
        catch( e )
        {
            console.log( 'something may be wrong in "onInit"', e );
        }

        let optionsCollection       = [];
        let selectOptionsCollection = [];

        let escapeHTML      = utils.escapeHTML;
        let props           = this.props;
        let data            = this.data = this.prepOptions( props.data || this.data );

        let handleChange    = this.handleChange.bind( this );
        let multiple        = this.multiple;
        let searchBool      = this.search;

        let defaultValue    = this._default = setDefaultOption( this, props, data );
        let defaultReact    = multiple ? [ defaultValue.value ] : defaultValue.value;

        let wrapperClass    = this.wrapperClass ? '  ' + this.wrapperClass : '';
        let flounderClass   = this.flounderClass ? '  ' + this.flounderClass : '';

        let _stateModifier  = this.state.modifier;
        _stateModifier = _stateModifier.length > 0 ? '--' + _stateModifier : '';

        return (
            <div ref="wrapper" className={classes.MAIN_WRAPPER + wrapperClass}>
                <div ref="flounder" tabIndex="0" className={classes.MAIN + flounderClass}>
                    <div ref="selected" className={classes.SELECTED_DISPLAYED} data-value={defaultValue.value}>
                        {defaultValue.text}
                    </div>
                    { multiple ? <div ref="multiTagWrapper" className={classes.MULTI_TAG_LIST}  multiple></div> : null }
                    <div ref="arrow" className={classes.ARROW}></div>
                    <div ref="optionsListWrapper" className={classes.OPTIONS_WRAPPER + '  ' + classes.HIDDEN}>
                        <div ref="optionsList" className={classes.LIST}>
                        {
                            data.map( ( dataObj, i ) =>
                            {
                                let extraClass = i === defaultValue.index ? '  ' + classes.SELECTED : '';
                                extraClass += dataObj.disabled ? '  ' + classes.DISABLED : '';
                                extraClass += dataObj.extraClass ? '  ' + dataObj.extraClass : '';

                                if ( typeof dataObj === 'string' )
                                {
                                    dataObj = [ dataObj, dataObj ];
                                }

                                return ( <div className={classes.OPTION + extraClass} data-index={i} key={i} ref={'option' + i}>
                                            {dataObj.text}
                                            {dataObj.description ?
                                                <div className={classes.DESCRIPTION}>
                                                    {dataObj.description}
                                                </div> :
                                                null
                                            }
                                        </div> );
                            } )
                        }
                        </div>
                    </div>
                    { searchBool ? <input ref="search" type="text" className={classes.SEARCH} /> : null }
                </div>
                <select ref="select" className={classes.SELECT_TAG + '  ' + classes.HIDDEN} defaultValue={defaultReact} tabIndex="-1" multiple={multiple}>
                {
                    data.map( ( dataObj, i ) =>
                    {
                        let extraClass  = i === defaultValue ? '  ' + this.selectedClass : '';

                        let res = {
                            className       : classes.OPTION + extraClass,
                            'data-index'    : i
                        };

                        return ( <option key={i} value ={dataObj.value} className={classes.OPTION_TAG} ref={'option' + i} disabled={dataObj.disabled}>
                                    {dataObj.text}
                                </option> );
                    } )
                }
                </select>
            </div>
        );
    }
}


let FlounderPrototype       = Flounder.prototype;
let FlounderReactPrototype  = FlounderReact.prototype;
let methods                 = Object.getOwnPropertyNames( FlounderPrototype );

methods.forEach( function( method )
{
    if ( !FlounderReactPrototype[ method ] && !FlounderPrototype[ method ].propertyIsEnumerable() )
    {
        FlounderReactPrototype[ method ] = FlounderPrototype[ method ]
    }
});

Object.defineProperty( FlounderReact, 'version', {
    get : function()
    {
        return version;
    }
} );

Object.defineProperty( FlounderReact.prototype, 'version', {
    get : function()
    {
        return version;
    }
} );

export default { React, Component, ReactDOM, FlounderReact, Flounder };

