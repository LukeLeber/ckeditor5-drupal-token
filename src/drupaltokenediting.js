/**
 * @module drupaltoken/drupaltokenediting
 */

import { Plugin } from "ckeditor5/src/core";
import { Widget } from "ckeditor5/src/widget";
import { toWidget, viewToModelPositionOutsideModelElement } from "ckeditor5/src/widget";

import InsertDrupalTokenCommand from "./insertdrupaltokencommand";

/**
 * The drupaltoken engine plugin.
 *
 * It registers:
 * * `<drupal-token>` as an inline element in the document schema
 * * converters for editing tokens
 * * `insertDrupalToken` command.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TokenEditing extends Plugin {

    /**
     * {@inheritDoc}
     */
    static get pluginName() {
        return 'DrupalTokenEditing';
    }

    /**
     * {@inheritDoc}
     */
    static get requires() {
        return [ Widget ];
    }

    /**
     * {@inheritDoc}
     */
    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'insertDrupalToken', new InsertDrupalTokenCommand( this.editor ) );

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'token' ) )
        );
    }

    /**
     * Registers model schema definitions.
     *
     * @private
     */
    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'drupaltoken', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributesOf: '$text',
            allowAttributes: [ 'name' ]
        } );
    }

    /**
     * Registers converters.
     *
     * @private
     */
    _defineConverters() {
        const conversion = this.editor.conversion;
        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'span',
                classes: [ 'token' ]
            },
            model: ( viewElement, { writer: modelWriter } ) => {
                const name = viewElement.getChild( 0 ).data.slice( 1, -1 );

                return modelWriter.createElement( 'drupaltoken', { name } );
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'drupaltoken',
            view: ( modelItem, { writer: viewWriter } ) => {
                const widgetElement = createTokenViewElement( modelItem, viewWriter );
                viewWriter.addClass('token', widgetElement);
                return toWidget( widgetElement, viewWriter );
            }
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'drupaltoken',
            view: ( modelItem, { writer: viewWriter } ) => createTokenViewElement( modelItem, viewWriter )
        } );
    }
}

/**
 * Creates a view element representing a drupal token.
 *
 * @param modelItem
 * @param viewWriter
 * @returns {*|module:engine/view/containerelement~ContainerElement}
 */
export function createTokenViewElement( modelItem, viewWriter ) {
    const name = modelItem.getAttribute( 'name' );
    const tokenView = viewWriter.createContainerElement( 'span' );
    viewWriter.addClass('token', tokenView);
    const innerText = viewWriter.createText( '[' + name + ']' );
    viewWriter.insert( viewWriter.createPositionAt( tokenView, 0 ), innerText );

    return tokenView;
}