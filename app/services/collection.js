import session from './session'
import config from "../config";

export default {
  async validateResponse(response) {
    if (!response.ok) throw new Error(await response.text());
  },
  async fetchCollections() {
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    const response = await fetch(`${config.SERVICE_URL}/collections`, {
      headers,
    });

    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },
  async fetchCollection(collectionId) {
    const response = await fetch(`${config.SERVICE_URL}/collections/${collectionId}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
        Accept: `application/json`,
      },
    });

    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },
  async fetchItems(collectionId) {
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    const response = await fetch(
      `${config.SERVICE_URL}/collections/${collectionId}/items?limit=100000`,
      {
        headers,
      }
    );

    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },
  async fetchItem(itemId) {
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    const response = await fetch(
      `${config.SERVICE_URL}/items/${itemId}`,
      {
        headers,
      }
    );

    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },

  async fetchItemsByNameWithin(collectionName, point, distance) {
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    const url = `${config.SERVICE_URL}/collections/by_name/${collectionName}/items?limit=100000&spatial_filter=within-distance&spatial_filter.distance.x=${point.x}&spatial_filter.distance.y=${point.y}&spatial_filter.distance.d=${distance}`;
    console.log(url);
    const response = await fetch(
      url,
      {
        headers,
      }
    );
    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },

  async fetchItemsByNameAndPropsWithin(collectionName, properties, point, distance) {
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    let property_filter = []
    for (const [key, value] of Object.entries(properties)) {
      property_filter.push(`${key}=${value}`);
    }
    const url = `${config.SERVICE_URL}/collections/by_name/${collectionName}/items?limit=100000&property_filter=${property_filter.join(',')}&spatial_filter=within-distance&spatial_filter.distance.x=${point.x}&spatial_filter.distance.y=${point.y}&spatial_filter.distance.d=${distance}`;
    console.log(url);
    const response = await fetch(
      url,
      {
        headers,
      }
    );
    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },

  async fetchItemsByNameAndProps(collectionName, properties) {
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;
    let property_filter = []
    for (const [key, value] of Object.entries(properties)) {
      property_filter.push(`${key}=${value}`);
    }
    const url = `${config.SERVICE_URL}/collections/by_name/${collectionName}/items?limit=100000&property_filter=${property_filter.join(',')}`;
    console.log(url);
    const response = await fetch(
      url,
      {
        headers,
      }
    );
    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },

  async createItems(collectionId, items) {
    const response = await fetch(`${config.SERVICE_URL}/collections/${collectionId}/items/bulk`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/geojson`,
        Accept: "application/geojson"
      },
      body: JSON.stringify(items)
    });

    await this.validateResponse(response);
  },
  async createItem(collectionId, item) {
    const response = await fetch(`${config.SERVICE_URL}/collections/${collectionId}/items`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/json`,
        Accept: "application/json"
      },
      body: JSON.stringify(item)
    });

    await this.validateResponse(response);
  },
  async removeItems(items) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      // TODO: Fix
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(`${config.SERVICE_URL}/items/${item.id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      // TODO: Fix
      // eslint-disable-next-line no-await-in-loop
      await this.validateResponse(response);
    }
  },
  async updateItems(items) {
    const response = await fetch(`${config.SERVICE_URL}/items`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/geojson`,
        Accept: 'application/geojson',
      },
      body: JSON.stringify({
        type: 'FeatureCollection',
        features: items,
      }),
    });

    await this.validateResponse(response);
  },
  async updateItem(item) {
    const response = await fetch(`${config.SERVICE_URL}/items/${item.uuid}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/json`,
        Accept: 'application/json',
      },
      body: JSON.stringify(item),
    });
    
    await this.validateResponse(response);
  },
  async create(collectionName, isPublic) {
    const response = await fetch(`${config.SERVICE_URL}/collections`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        name: collectionName,
        is_public: isPublic,
      }),
    });

    await this.validateResponse(response);

    const collection = await response.json();
    return collection;
  }
};
