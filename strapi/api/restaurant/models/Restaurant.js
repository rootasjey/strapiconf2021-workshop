'use strict';

const config = require("platformsh-config").config();
const solr = require("solr-node");

/**
 * Lifecycle callbacks for the `Restaurant` model.
 */

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      strapi.services.history.create({
        action: 'create',
        contenttype: 'restaurant',
        author: data.author_,
        before: {},
        after: result
      });

      console.log("afterCreate");
      const client = new solr(config.formattedCredentials("solr", "solr-node"));
      
      // Add a document.
      const addResult = await client.update({
        id: 123,
        name: "Valentina Tereshkova",
      });

      // Flush writes so that we can query against them.
      await client.softCommit();
      // try {
        
      // } catch (error) {
      //   console.error(error);
      // }
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
