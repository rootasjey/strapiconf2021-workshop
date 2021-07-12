'use strict';

const config = require("platformsh-config").config();

/**
 * Lifecycle callbacks for the `Restaurant` model.
 */

module.exports = {
  lifecycles: {
    afterCreate(result, data) {
      strapi.services.history.create({
        action: 'create',
        contenttype: 'restaurant',
        author: data.author_,
        before: {},
        after: result
      });

      console.log("afterCreate");
    },
    async beforeUpdate(params, data){
      const [previous_] = await strapi.services.restaurant.find(params);
      data.previous_ = previous_;
    },
    afterUpdate(result, params, data){
      strapi.services.history.create({
        action: 'update',
        contenttype: 'restaurant',
        author: data.author_,
        before: data.previous_,
        after: result
      });
    }
  }
};
