import React from 'react';
import Entity from './Entity';

/**
 * Base component to manage Document detail view. All documents inherits from it
 */
class Document extends Entity {

    // Navigation bar specific options
    static navigationOptions = ({navigation}) => {
        return Entity.navigationOpts(navigation);
    };
}

export default Document;