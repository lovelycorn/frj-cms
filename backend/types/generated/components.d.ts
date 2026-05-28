import type { Schema, Struct } from '@strapi/strapi';

export interface ProductSpecificationItem extends Struct.ComponentSchema {
  collectionName: 'components_product_specification_items';
  info: {
    description: 'Key-value product specification row';
    displayName: 'Specification Item';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    unit: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata component';
    displayName: 'SEO';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 320;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface TrackingUtmParams extends Struct.ComponentSchema {
  collectionName: 'components_tracking_utm_params';
  info: {
    description: 'Campaign attribution metadata';
    displayName: 'UTM Params';
  };
  attributes: {
    utm_campaign: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    utm_content: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    utm_medium: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    utm_source: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    utm_term: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.specification-item': ProductSpecificationItem;
      'shared.seo': SharedSeo;
      'tracking.utm-params': TrackingUtmParams;
    }
  }
}
