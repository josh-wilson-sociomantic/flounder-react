/* global document, QUnit  */

import classes from '../../src/core/classes';

let tests = function( Flounder, React, ReactDOM )
{
    QUnit.module( 'flounder.js' );


    /*
     * ## arrayOfFlounders tests
     *
     * @test exists
     * @test multiple targets returns an array
     * @test of flounders
     */
    QUnit.test( 'arrayOfFlounders', function( assert )
    {
        let flounder    = ReactDOM.render( React.createElement( Flounder, {} ), document.querySelector( '.flounder-test__target' ) );
        assert.ok( flounder.arrayOfFlounders, 'exists' );

        flounder.destroy();
        // let flounders   = flounder.arrayOfFlounders( [ document.querySelector( '.flounder-test__target' ) ], flounder.props );
        // assert.ok( Array.isArray( flounders ), 'multiple targets returns an array' );
        // assert.ok( flounders[0] instanceof Flounder, 'of flounders' );

        // flounders.forEach( function( el ){ el.destroy() } );
    } );


    /*
     * ## blur Opened Dropdowns
     *
     * @test exists
     * @test multiple targets returns an array
     * @test of flounders
     */
    QUnit.test( 'blurOpenedDropdown', function( assert )
    {
                window.React = React;
        window.ReactDOM = ReactDOM;
        window.Flounder = Flounder;


        let data = [
            {
                text : "Item 1",
                value : "item1"
            },
            {
                text : "Item 2",
                value : "item2"
            }
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0 } ),
                document.querySelector( '.flounder-test__target' ) );

        flounder.setByValue( 'item1' );
        flounder.refs.selected.click();

        document.body.click();

        assert.equal( flounder.refs.selected.innerHTML, 'Item 1',
                                        'text stays after focusout' );

        flounder.destroy();
    } );


    /*
     * ## componentWillUnmount tests
     *
     * @test exists
     * @test events are removed
     */
    QUnit.test( 'componentWillUnmount', function( assert )
    {
        let flounder    = ReactDOM.render( React.createElement( Flounder, {} ), document.querySelector( '.flounder-test__target' ) );
        assert.ok( flounder.componentWillUnmount, 'exists' );

        let refs        = flounder.refs;
        refs.selected.click();

        let firstCheck = refs.wrapper.className.indexOf( 'open' );
        flounder.componentWillUnmount();
        refs.selected.click();

        let secondCheck = refs.wrapper.className.indexOf( 'open' );
        flounder.destroy();

        assert.ok( firstCheck === secondCheck, 'events are removed' );
    } );


    /*
     * ## displayMultipleTags tests
     *
     * @test exists
     * @test tags are created for all clicks
     * @test close events are properly bound
     */
    QUnit.test( 'displayMultipleTags', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder = ReactDOM.render( React.createElement( Flounder,
                {
                    multiple        : true,
                    multipleTags    : true,
                    data            : data
                } ), document.querySelector( '.flounder-test__target' ) );


        assert.ok( flounder.displayMultipleTags, 'exists' );

        let refsData       = flounder.refs.data;
        refsData[ 1 ].click();
        refsData[ 2 ].click();

        assert.equal( document.querySelectorAll( '.flounder__multiple--select--tag' ).length,
                                        2, 'tags are created for all clicks' );

        var closeDivs = document.querySelectorAll( '.flounder__multiple__tag__close' );
        closeDivs = Array.prototype.slice.call( closeDivs );
        closeDivs.forEach( function( el )
        {
            el.click();
        } );
        assert.equal( document.querySelectorAll( '.flounder__multiple--select--tag' ).length,
                                        0, 'close events are properly bound' );

        flounder.destroy();
    } );


    /*
     * ## displaySelected tests
     *
     * @test exists
     * @test the correct thing is displayed
     */
    QUnit.test( 'displaySelected', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0 } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.displaySelected, 'exists' );
        flounder.setByIndex( 1 );

        assert.equal( flounder.refs.selected.textContent,
                    flounder.refs.data[ 1 ].textContent, 'The correct thing is displayed' );

        flounder.destroy();
    } );


    /*
     * ## fuzzySearch tests
     *
     * @test exists
     * @test correctly filters data elements
     */
    QUnit.test( 'fuzzySearch', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];


        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0, search : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.fuzzySearch, 'exists' );

        let flounderRefs = flounder.refs;

        flounderRefs.search.click();
        flounder.fuzzySearch( { keyCode : 77,
                                preventDefault : e => e,
                                target  : { value : 'm  ' }
                                } );

        let hiddenOptions = flounderRefs.optionsListWrapper.querySelectorAll( '.' + classes.SEARCH_HIDDEN );

        assert.deepEqual( hiddenOptions[ 0 ], flounderRefs.data[ 0 ], 'correctly filters data elements' );
        flounder.destroy();
    } );


    /*
     * ## fuzzySearchReset tests
     *
     * @test exists
     * @test correctly blanks the search input
     * @test correctly resets search filtered elements
     */
    QUnit.test( 'fuzzySearchReset', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0, search : true } ),
                document.querySelector( '.flounder-test__target' ) );


        assert.ok( flounder.fuzzySearchReset, 'exists' );

        let flounderRefs = flounder.refs;

        flounderRefs.search.click();
        flounder.fuzzySearch( { keyCode : 77,
                                preventDefault : e => e,
                                target  : { value : 'm  ' }
                                } );
        flounder.fuzzySearchReset();
        let hiddenOptions = flounderRefs.optionsListWrapper.querySelectorAll( '.' + classes.SEARCH_HIDDEN );

        assert.equal( flounderRefs.search.value, '', 'correctly blanks the search input' );
        assert.equal( hiddenOptions.length, 0, 'correctly resets search filtered elements' );
        flounder.destroy();
    } );


    /*
     * ## initializeOptions tests
     *
     * @test exists
     */
    QUnit.test( 'initializeOptions', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0, search : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.initializeOptions, 'exists' );

        assert.ok( flounder.data[0].text === 'doge', 'correctly sets data' );
        assert.ok( flounder.search, 'correctly sets a prop' );
        assert.ok( flounder.defaultIndex === 0, 'correctly sets a different prop' );

        flounder.destroy();
    } );


    /*
     * ## onRender tests
     *
     * @test exists
     */
    QUnit.test( 'onRender', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0, search : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.onRender, 'exists' );

        flounder.destroy();
    } );


    /*
     * ## removeMultiTag tests
     *
     * @test exists
     */
    QUnit.test( 'removeMultiTag', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, placeholder : 'placeholders!', multipleTags : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.removeMultiTag, 'exists' );

        let refs = document.querySelector( '.flounder-test__target' ).flounder.refs;

        let doge = refs.data[1];
        doge.click();

        let multiTagWrapper = refs.multiTagWrapper;
        multiTagWrapper.children[0].children[0].click();

        assert.equal( multiTagWrapper.children.length, 0, 'tag is removed' );

        flounder.destroy();
    } );


    /*
     * ## removeSelectedClass tests
     *
     * @test exists
     */
    QUnit.test( 'removeSelectedClass', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, placeholder:'moon!', multipleTags : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.removeSelectedClass, 'exists' );

        let refs = flounder.refs;

        refs.data[1].click();
        refs.data[2].click();

        flounder.removeSelectedClass();
        let selected = refs.optionsList.querySelectorAll( '.flounder__option--selected' );

        assert.equal( selected.length, 0, 'selected class is removed from divs' );

        flounder.destroy();
    } );


    /*
     * ## removeSelectedValue tests
     *
     * @test exists
     */
    QUnit.test( 'removeSelectedValue', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0, multipleTags : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.removeSelectedValue, 'exists' );

        let refs = flounder.refs;
        refs.data[0].click();
        refs.data[1].click();

        flounder.removeSelectedValue();

        assert.equal( refs.select.selectedOptions.length, 0, 'selected is set to false for options' );

        flounder.destroy();
    } );


    /*
     * ## setTextMultiTagIndent tests
     *
     * @test exists
     */
    QUnit.test( 'setTextMultiTagIndent', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data, defaultIndex : 0, placeholder : 'placeholders!', multipleTags : true } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.setTextMultiTagIndent, 'exists' );

        let refs = flounder.refs;

        let span = document.createElement( 'SPAN' );
        span.className = 'flounder__multiple--select--tag';
        span.innerHTML = '<a class="flounder__multiple__tag__close" data-index="1"></a>doge';

        refs.multiTagWrapper.appendChild( span );

        flounder.setTextMultiTagIndent();

        let style = getComputedStyle( span );

        let spanOffset = span.offsetWidth + parseInt( style[ 'margin-left' ] ) + parseInt( style[ 'margin-right' ] );
        assert.equal( refs.search.style.textIndent, spanOffset + 'px', 'search box text indent is correctly set' );

        flounder.destroy();
    } );


    /*
     * ## sortData tests
     *
     * @test exists
     */
    QUnit.test( 'sortData', function( assert )
    {
        let data = [
            'doge',
            'moon'
        ];

        let flounder    = ReactDOM.render( React.createElement( Flounder,
                { data : data } ),
                document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.sortData, 'exists' );

        let sortedData  = flounder.sortData( ['doge','moon'] );

        assert.equal( sortedData[0].index, 0, 'sets the index' );

        sortedData      = flounder.sortData( [{text:'doge',value:'moon'},'moon'] );
        assert.equal( sortedData[0].value, 'moon', 'sets the value' );

        flounder.destroy();
    } );


    /*
     * ## version tests
     *
     * @test exists
     */
    QUnit.test( 'version', function( assert )
    {
        let flounder    = ReactDOM.render( React.createElement( Flounder,
                {} ), document.querySelector( '.flounder-test__target' ) );

        assert.ok( flounder.version, 'exists' );

        assert.equal( Flounder.version, flounder.version, 'shows the version' );

        // strict mode doesnt like this
        // flounder.version = 'moin!';
        // assert.equal( Flounder.version, flounder.version, 'instance version is read only' );
        // Flounder.version = 'moin!';
        // assert.equal( Flounder.version, flounder.version, 'constructor version is read only' );

        flounder.destroy();
    } );
};

export default tests;
