'use strict';

const solr = require("solr-node");
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

      const client = new solr(config.formattedCredentials("solr", "solr-node"));

      // Add a document.
      const addResult = await client.update({
        id: 123,
        ...data,
      });

      // Flush writes so that we can query against them.
      await client.softCommit();
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
