/**
 * @module drupaltoken/drupaltoken
 */

import { Plugin } from "ckeditor5/src/core";

import DrupalTokenEditing from './drupaltokenediting';
import DrupalTokenUI from './drupaltokenui';

/**
 * The drupal token plugin.
 *
 * This is a "glue" plugin that loads the following plugins:
 *
 * * {@link module:drupaltoken/drupaltoken~DrupalTokenEditing}
 * * {@link module:drupaltoken/drupaltoken~DrupalTokenUI}
 *
 * @extends module:core/plugin~Plugin
 */
export default class DrupalToken extends Plugin {

    /**
     * {@inheritDoc}
     */
    static get pluginName() {
        return 'DrupalToken';
    }

    /**
     * {@inheritDoc}
     */
    static get requires() {
        return [ DrupalTokenEditing, DrupalTokenUI ];
    }
}

/**
 * The configuration of the drupaltoken features.
 *
 * Read more in {@link module:drupaltoken/drupaltoken~DrupalTokenConfig}.
 *
 * @member {module:drupaltoken/drupaltoken~DrupalTokenConfig} module:core/editor/editorconfig~EditorConfig#drupalToken
 */


/**
 * The configuration of the drupaltoken features.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 * 				drupalToken: ... // Drupaltoken feature options.
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface DrupalTokenConfig
 *
 * @member {Array} module:drupaltoken/drupaltoken~DrupalTokenConfig#tokens
 */