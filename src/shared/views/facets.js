var Facets = Backbone.View.extend({
  
  initialize: function(options) {
    this.browser = options.browser;
    this.selectedFacet = graph.get('/type/document').all('properties').first().key;
    this.facetChoices = {};
  },
  
  select: function(property) {
    this.selectedFacet = property;
    $('.facet').removeClass('selected');
    $('#facet_'+property).toggleClass('selected');
  },
  
  addChoice: function(property, operator, value) {
    // TODO: build flexible lookup for arbitrary operators (GT, LT etc.)
    this.facetChoices[property+'::'+operator+'::'+value] = true;
  },
  
  removeChoice: function(property, operator, value) {
    delete this.facetChoices[property+'::'+operator+'::'+value];
  },
  
  buildView: function() {
    var that = this;
    var view = {facets: []};
    
    graph.get('/type/document').all('properties').each(function(property, key) {
      
      if (property.type !== 'number' && property.type !== 'collection' && property.key !== 'id') {
        
        var facet_choices = [];
        var selected_facet_choices = [];
        property.all("values").each(function(value) {
          if (that.facetChoices[key+'::CONTAINS::'+value.val] === true) {
            selected_facet_choices.push({excaped_value: escape(value.val), value: value.val, item_count: value.referencedObjects.length});
          } else {
            if (value.val && value.val.length > 0) {
              facet_choices.push({excaped_value: escape(value.val), value: value.val, item_count: value.referencedObjects.length});
            }
          }
        });
        
        // !_.include(["title", "name", "sections"], property.key) && 
        if (facet_choices.length + selected_facet_choices.length > 0) {
          console.log('puink');
          view.facets.push({
            property: key,
            property_name: property.name,
            facet_choices: facet_choices,
            selected_facet_choices: selected_facet_choices
          });          
        }
      }
    });
    
    return view;
  },
  
  render: function() {
    var that = this;
    $(this.el).html(_.renderTemplate('facets', this.buildView()));
    this.select(this.selectedFacet);
  }
});