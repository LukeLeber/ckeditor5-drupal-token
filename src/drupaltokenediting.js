import { Plugin } from "ckeditor5/src/core";
import { Widget } from "ckeditor5/src/widget";
import { toWidget, viewToModelPositionOutsideModelElement } from "ckeditor5/src/widget";
import DrupalTokenCommand from "./drupaltokencommand";

export default class TokenEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'drupaltoken', new DrupalTokenCommand( this.editor ) );

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'token' ) )
        );
        this.editor.config.define( 'drupalTokenConfig', {
            types: [ 'drupal-token' ]
        } );
    }

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

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'span',
                classes: [ 'token' ]
            },
            model: ( viewElement, { writer: modelWriter } ) => {
                // Extract the "name" from "{name}".
                const name = viewElement.getChild( 0 ).data.slice( 1, -1 );

                return modelWriter.createElement( 'drupaltoken', { name } );
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'drupaltoken',
            view: ( modelItem, { writer: viewWriter } ) => {
                const widgetElement = createTokenView( modelItem, viewWriter );

                // Enable widget handling on a token element inside the editing view.
                return toWidget( widgetElement, viewWriter );
            }
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'drupaltoken',
            view: ( modelItem, { writer: viewWriter } ) => createTokenView( modelItem, viewWriter )
        } );

        // Helper method for both downcast converters.
        function createTokenView( modelItem, viewWriter ) {
            const name = modelItem.getAttribute( 'name' );

            const tokenView = viewWriter.createContainerElement( 'span', {
                class: ['token token--' + name]
            }, {
                isAllowedInsideAttributeElement: true
            } );

            // Insert the token name (as a text).
            const innerText = viewWriter.createText( '[' + name + ']' );
            viewWriter.insert( viewWriter.createPositionAt( tokenView, 0 ), innerText );

            return tokenView;
        }
    }
}
