const BASE_URL = "http://dev.gia.fpx.se/api/v1";

export default {
  token: null,
  user: null,
  async validateResponse(response) {
    if (!response.ok) throw new Error(await response.text());
  },
  async create(email, password) {
    const response = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': `application/json`,
        Accept: `application/json`,
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });
    
    await this.validateResponse(response);
    this.token = (await response.json()).access_token;
    this.user = await this.getUser();
  },
  clear() {
    this.token = null;
    this.user = null;
  },
  authenticated() {
    return !!this.token;
  },
  async getUser() {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      Accept: `application/json`,
    };
    let response = await fetch(`${BASE_URL}/users/uuid`, {
      headers,
    });
    await this.validateResponse(response);
    const userUuid = (await response.json()).uuid;
    response = await fetch(`${BASE_URL}/users/${userUuid}`, {
      headers,
    });
    await this.validateResponse(response);
    const user = await response.json();
    return user;
  },
};
